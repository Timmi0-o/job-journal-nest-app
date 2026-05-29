import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
  Optional,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorSeverity, isAtLeastSeverity } from '../enums/error-severity.enum';
import { CATEGORY_LOG_LEVELS } from '../enums/error-category.enum';
import { isBaseError } from '../errors/base/base-error';
import { ERRORS_MODULE_OPTIONS } from '../module/errors.constants';
import type { IErrorsModuleOptions } from '../interfaces/error-options.interface';

/**
 * Interceptor for logging errors with context information.
 *
 * This interceptor catches errors from the handler pipeline,
 * logs them with appropriate context, and re-throws them.
 *
 * @example
 * ```typescript
 * @UseInterceptors(ErrorLoggingInterceptor)
 * @Controller()
 * export class UserController {
 *   // ...
 * }
 * ```
 */
@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorLoggingInterceptor.name);
  private readonly minLogSeverity: ErrorSeverity;

  constructor(
    @Optional()
    @Inject(ERRORS_MODULE_OPTIONS)
    options?: IErrorsModuleOptions,
  ) {
    this.minLogSeverity = options?.minLogSeverity ?? ErrorSeverity.LOW;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    return next.handle().pipe(
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Log the error with context
        this.logError(error, {
          className,
          methodName,
          duration,
          contextType: context.getType(),
        });

        // Re-throw the error for the filter to handle
        return throwError(() => error);
      }),
    );
  }

  /**
   * Log the error with context information.
   */
  private logError(
    error: unknown,
    context: {
      className: string;
      methodName: string;
      duration: number;
      contextType: string;
    },
  ): void {
    if (isBaseError(error)) {
      // Check minimum severity
      if (!isAtLeastSeverity(error.severity, this.minLogSeverity)) {
        return;
      }

      const logData = {
        ...error.toLogFormat(),
        handler: `${context.className}.${context.methodName}`,
        duration: `${context.duration}ms`,
        contextType: context.contextType,
      };

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
    } else if (error instanceof Error) {
      // Standard error - always log as error
      this.logger.error(
        {
          name: error.name,
          message: error.message,
          handler: `${context.className}.${context.methodName}`,
          duration: `${context.duration}ms`,
          contextType: context.contextType,
        },
        error.stack,
        error.name,
      );
    } else {
      // Unknown error
      this.logger.error(
        {
          error: String(error),
          handler: `${context.className}.${context.methodName}`,
          duration: `${context.duration}ms`,
          contextType: context.contextType,
        },
        undefined,
        'UnknownError',
      );
    }
  }
}
