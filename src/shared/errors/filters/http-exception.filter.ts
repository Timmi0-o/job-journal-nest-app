import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Optional,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorSeverity, isAtLeastSeverity } from '../enums/error-severity.enum';
import { CATEGORY_LOG_LEVELS } from '../enums/error-category.enum';
import { BaseError, isBaseError } from '../errors/base/base-error';
import { InternalError } from '../errors/technical/internal-error';
import { ValidationError } from '../errors/business/validation-error';
import { NotFoundError } from '../errors/business/not-found-error';
import { UnauthorizedError } from '../errors/business/unauthorized-error';
import { ForbiddenError } from '../errors/business/forbidden-error';
import { ERRORS_MODULE_OPTIONS } from '../module/errors.constants';
import type { IErrorsModuleOptions } from '../interfaces/error-options.interface';

interface IHttpErrorResponse {
  statusCode: number;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  path: string;
  correlationId?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly serviceName?: string;
  private readonly logErrors: boolean;
  private readonly minLogSeverity: ErrorSeverity;

  constructor(
    @Optional()
    @Inject(ERRORS_MODULE_OPTIONS)
    options?: IErrorsModuleOptions,
  ) {
    this.serviceName = options?.serviceName;
    this.logErrors = options?.logErrors ?? true;
    this.minLogSeverity = options?.minLogSeverity ?? ErrorSeverity.LOW;
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId =
      (request.headers['x-correlation-id'] as string) ??
      (request.headers['x-request-id'] as string);

    const error = this.normalizeError(exception, correlationId, request);

    if (this.logErrors) {
      this.logError(error);
    }

    const httpResponse = this.buildHttpResponse(error, request);

    if (error.correlationId) {
      response.setHeader('x-correlation-id', error.correlationId);
    }

    const retryAfter = error.metadata?.retryAfterSeconds as number | undefined;
    if (retryAfter) {
      response.setHeader('Retry-After', retryAfter.toString());
    }

    response.status(error.httpStatus).json(httpResponse);
  }

  private normalizeError(
    exception: unknown,
    correlationId?: string,
    request?: Request,
  ): BaseError {
    if (isBaseError(exception)) {
      let error = exception;

      if (!error.serviceName && this.serviceName) {
        error = error.withServiceName(this.serviceName);
      }

      if (!error.correlationId && correlationId) {
        error = error.withCorrelationId(correlationId);
      }

      return error;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message = exception.message;
      let validationErrors: Record<string, string[]> | undefined;

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = typeof resp.message === 'string' ? resp.message : message;

        if (Array.isArray(resp.message)) {
          const messages = resp.message.filter(
            (m): m is string => typeof m === 'string',
          );
          validationErrors = this.parseValidationMessages(messages);
          message = 'Validation failed';
        }
      }

      const error = this.httpStatusToError(
        status,
        message,
        validationErrors,
        correlationId,
      );

      return error.withContext({
        method: request?.method,
        endpoint: request?.url,
      });
    }

    if (exception instanceof Error) {
      return new InternalError(exception.message, {
        serviceName: this.serviceName,
        correlationId,
        causedBy: exception,
        context: {
          method: request?.method,
          endpoint: request?.url,
        },
      });
    }

    return new InternalError('An unknown error occurred', {
      serviceName: this.serviceName,
      correlationId,
      context: {
        method: request?.method,
        endpoint: request?.url,
      },
    });
  }

  private httpStatusToError(
    status: number,
    message: string,
    validationErrors?: Record<string, string[]>,
    correlationId?: string,
  ): BaseError {
    const baseOptions = {
      serviceName: this.serviceName,
      correlationId,
    };

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        if (validationErrors) {
          return new ValidationError(message, {
            ...baseOptions,
            validationErrors,
          });
        }
        return new ValidationError(message, baseOptions);

      case HttpStatus.UNAUTHORIZED:
        return new UnauthorizedError(message, baseOptions);

      case HttpStatus.FORBIDDEN:
        return new ForbiddenError(message, baseOptions);

      case HttpStatus.NOT_FOUND:
        return new NotFoundError('Resource', undefined, baseOptions);

      default:
        return new InternalError(message, baseOptions);
    }
  }

  private parseValidationMessages(
    messages: string[],
  ): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    for (const message of messages) {
      const match = message.match(/^(\w+)\s+(.+)$/);
      if (match) {
        const field = match[1];
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(message);
      } else {
        if (!errors._general) {
          errors._general = [];
        }
        errors._general.push(message);
      }
    }

    return errors;
  }

  private buildHttpResponse(error: BaseError, request: Request): IHttpErrorResponse {
    const response: IHttpErrorResponse = {
      statusCode: error.httpStatus,
      error: {
        code: error.errorCode,
        message: error.message,
      },
      timestamp: error.timestamp.toISOString(),
      path: request.url,
    };

    if (error.correlationId) {
      response.correlationId = error.correlationId;
    }

    if (error instanceof ValidationError && error.validationErrors) {
      response.error.details = {
        validationErrors: error.validationErrors,
      };
    }

    return response;
  }

  private logError(error: BaseError): void {
    if (!isAtLeastSeverity(error.severity, this.minLogSeverity)) {
      return;
    }

    const logData = error.toLogFormat();
    const logLevel = CATEGORY_LOG_LEVELS[error.category];

    switch (logLevel) {
      case 'debug':
        this.logger.debug(logData, error.name);
        break;
      case 'info':
        this.logger.log(logData, error.name);
        break;
      case 'warn':
        this.logger.warn(logData, error.name);
        break;
      case 'error':
      default:
        this.logger.error(logData, error.stack, error.name);
        break;
    }
  }
}
