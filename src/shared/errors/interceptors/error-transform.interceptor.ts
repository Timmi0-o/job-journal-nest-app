import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { Request } from 'express';
import { BaseError, isBaseError } from '../errors/base/base-error';
import { InternalError } from '../errors/technical/internal-error';
import { IErrorContext } from '../interfaces/error-context.interface';
import { ERRORS_MODULE_OPTIONS } from '../module/errors.constants';
import type { IErrorsModuleOptions } from '../interfaces/error-options.interface';

@Injectable()
export class ErrorTransformInterceptor implements NestInterceptor {
  private readonly serviceName?: string;

  constructor(
    @Optional()
    @Inject(ERRORS_MODULE_OPTIONS)
    options?: IErrorsModuleOptions,
  ) {
    this.serviceName = options?.serviceName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const errorContext = this.extractHttpContext(context);

    return next.handle().pipe(
      catchError((error) => {
        const transformedError = this.transformError(error, errorContext);
        return throwError(() => transformedError);
      }),
    );
  }

  private extractHttpContext(
    context: ExecutionContext,
  ): Partial<IErrorContext> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    try {
      const request = context.switchToHttp().getRequest<Request>();
      return {
        className,
        methodName,
        serviceName: this.serviceName,
        endpoint: request?.url,
        method: request?.method,
        clientIp: request?.ip,
        userAgent: request?.headers?.['user-agent'],
        requestId: request?.headers?.['x-request-id'] as string | undefined,
        traceId: request?.headers?.['x-trace-id'] as string | undefined,
        userId: (request as Request & { user?: { id?: string } }).user?.id,
      };
    } catch {
      return {
        className,
        methodName,
        serviceName: this.serviceName,
      };
    }
  }

  private transformError(
    error: unknown,
    errorContext: Partial<IErrorContext>,
  ): BaseError {
    if (isBaseError(error)) {
      if (!error.context) {
        return error.withContext(errorContext as IErrorContext);
      }
      return error;
    }

    if (error instanceof Error) {
      return new InternalError(error.message, {
        causedBy: error,
        serviceName: this.serviceName,
        context: errorContext as IErrorContext,
        metadata: {
          originalErrorName: error.name,
        },
      });
    }

    const message =
      typeof error === 'string' ? error : 'An unexpected error occurred';

    return new InternalError(message, {
      serviceName: this.serviceName,
      context: errorContext as IErrorContext,
      metadata: {
        originalType: typeof error,
        originalValue: String(error),
      },
    });
  }
}
