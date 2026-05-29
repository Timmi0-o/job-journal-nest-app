import { ErrorSeverity } from '../enums/error-severity.enum';
import { ErrorCategory } from '../enums/error-category.enum';
import { IErrorMetadata } from './error-metadata.interface';
import { IErrorContext } from './error-context.interface';

/**
 * Base options for creating errors.
 */
export interface IBaseErrorOptions {
  /**
   * Error severity level.
   */
  severity?: ErrorSeverity;

  /**
   * Error category.
   */
  category?: ErrorCategory;

  /**
   * Additional metadata.
   */
  metadata?: IErrorMetadata;

  /**
   * Error context.
   */
  context?: IErrorContext;

  /**
   * Service name where error occurred.
   */
  serviceName?: string;

  /**
   * Correlation ID for distributed tracing.
   */
  correlationId?: string;

  /**
   * Original error that caused this error.
   */
  causedBy?: Error;

  /**
   * Whether this error is retriable.
   * If not specified, will be determined based on HTTP status.
   */
  isRetriable?: boolean;
}

/**
 * Options for validation errors.
 */
export interface IValidationErrorOptions extends IBaseErrorOptions {
  /**
   * Validation error details by field.
   */
  validationErrors?: Record<string, string[]>;
}

/**
 * Options for not found errors.
 */
export interface INotFoundErrorOptions extends IBaseErrorOptions {
  /**
   * Resource type that was not found.
   */
  resourceType?: string;

  /**
   * Resource identifier.
   */
  resourceId?: string | number;
}

/**
 * Options for timeout errors.
 */
export interface ITimeoutErrorOptions extends IBaseErrorOptions {
  /**
   * Operation that timed out.
   */
  operation?: string;

  /**
   * Timeout duration in milliseconds.
   */
  timeoutMs?: number;
}

/**
 * Options for service unavailable errors.
 */
export interface IServiceUnavailableErrorOptions extends IBaseErrorOptions {
  /**
   * Name of the unavailable service.
   */
  targetService?: string;

  /**
   * Retry after duration in seconds.
   */
  retryAfter?: number;
}

/**
 * Options for external service errors.
 */
export interface IExternalServiceErrorOptions extends IBaseErrorOptions {
  /**
   * Name of the external service.
   */
  serviceName?: string;

  /**
   * Endpoint that was called.
   */
  endpoint?: string;

  /**
   * HTTP status code from external service.
   */
  statusCode?: number;

  /**
   * Response from external service.
   */
  response?: unknown;
}

/**
 * Options for database errors.
 */
export interface IDatabaseErrorOptions extends IBaseErrorOptions {
  /**
   * Database operation.
   */
  operation?: string;

  /**
   * Table or collection name.
   */
  table?: string;

  /**
   * Constraint that was violated.
   */
  constraint?: string;

  /**
   * Original database error code.
   */
  dbErrorCode?: string;
}

/**
 * Options for conflict errors.
 */
export interface IConflictErrorOptions extends IBaseErrorOptions {
  /**
   * Resource type that conflicts.
   */
  resourceType?: string;

  /**
   * Resource identifier.
   */
  resourceId?: string | number;

  /**
   * Conflicting field name.
   */
  conflictingField?: string;

  /**
   * Conflicting value.
   */
  conflictingValue?: unknown;
}

/**
 * Module configuration options.
 */
export interface IErrorsModuleOptions {
  /**
   * Default service name for errors.
   */
  serviceName?: string;

  /**
   * Whether to register global exception filter.
   * @default true
   */
  globalFilter?: boolean;

  /**
   * Whether to register global error logging interceptor.
   * @default true
   */
  globalInterceptor?: boolean;

  /**
   * Whether to include stack traces in serialized errors.
   * @default false in production, true otherwise
   */
  includeStackTrace?: boolean;

  /**
   * Whether to log errors.
   * @default true
   */
  logErrors?: boolean;

  /**
   * Minimum severity level to log.
   * @default ErrorSeverity.LOW
   */
  minLogSeverity?: ErrorSeverity;

  /**
   * Custom sanitizer function for removing sensitive data.
   */
  sanitizer?: (data: Record<string, unknown>) => Record<string, unknown>;
}
