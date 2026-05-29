import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { ITimeoutErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when an operation times out.
 *
 * Use this error for:
 * - Request timeout
 * - Database query timeout
 * - External service timeout
 * - Long-running operation timeout
 *
 * @example
 * ```typescript
 * throw new TimeoutError('getUserProfile', 5000);
 * throw TimeoutError.request('GET /api/users', 30000);
 * throw TimeoutError.database('SELECT * FROM users', 10000);
 * ```
 */
export class TimeoutError extends BaseError {
  /**
   * Operation that timed out.
   */
  public readonly operation: string;

  /**
   * Timeout duration in milliseconds.
   */
  public readonly timeoutMs: number;

  constructor(operation: string, timeoutMs: number, options?: ITimeoutErrorOptions) {
    super(
      `Operation '${operation}' timed out after ${timeoutMs}ms`,
      HttpStatus.GATEWAY_TIMEOUT,
      ErrorCodes.TIMEOUT,
      {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.TIMEOUT,
        isRetriable: true,
        ...options,
        metadata: {
          ...options?.metadata,
          operation,
          timeoutMs,
        },
      },
    );

    this.operation = operation;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Create a TimeoutError for a request timeout.
   */
  static request(
    endpoint: string,
    timeoutMs: number,
    options?: Omit<ITimeoutErrorOptions, 'operation' | 'timeoutMs'>,
  ): TimeoutError {
    return new TimeoutError(`Request to ${endpoint}`, timeoutMs, {
      ...options,
      metadata: {
        ...options?.metadata,
        type: 'REQUEST_TIMEOUT',
        endpoint,
      },
    });
  }

  /**
   * Create a TimeoutError for a database operation timeout.
   */
  static database(
    query: string,
    timeoutMs: number,
    options?: Omit<ITimeoutErrorOptions, 'operation' | 'timeoutMs'>,
  ): TimeoutError {
    // Sanitize query to avoid logging sensitive data
    const sanitizedQuery = query.length > 100 ? query.substring(0, 100) + '...' : query;
    return new TimeoutError(`Database query: ${sanitizedQuery}`, timeoutMs, {
      ...options,
      category: ErrorCategory.DATABASE,
      metadata: {
        ...options?.metadata,
        type: 'DATABASE_TIMEOUT',
      },
    });
  }

  /**
   * Create a TimeoutError for an external service call timeout.
   */
  static externalService(
    serviceName: string,
    timeoutMs: number,
    options?: Omit<ITimeoutErrorOptions, 'operation' | 'timeoutMs'>,
  ): TimeoutError {
    return new TimeoutError(`External service call to ${serviceName}`, timeoutMs, {
      ...options,
      category: ErrorCategory.EXTERNAL_SERVICE,
      metadata: {
        ...options?.metadata,
        type: 'EXTERNAL_SERVICE_TIMEOUT',
        serviceName,
      },
    });
  }

  /**
   * Create a TimeoutError for a connection timeout.
   */
  static connection(
    target: string,
    timeoutMs: number,
    options?: Omit<ITimeoutErrorOptions, 'operation' | 'timeoutMs'>,
  ): TimeoutError {
    return new TimeoutError(`Connection to ${target}`, timeoutMs, {
      ...options,
      category: ErrorCategory.NETWORK,
      metadata: {
        ...options?.metadata,
        type: 'CONNECTION_TIMEOUT',
        target,
      },
    });
  }

  /**
   * Create a TimeoutError with a custom message (without technical details).
   *
   * @example
   * ```typescript
   * throw TimeoutError.withMessage('Превышено время ожидания ответа');
   * ```
   */
  static withMessage(message: string, options?: ITimeoutErrorOptions): TimeoutError {
    // Create with placeholder values that won't appear in message
    const error = new TimeoutError('operation', 0, options);
    // Override the message directly
    Object.defineProperty(error, 'message', {
      value: message,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    return error;
  }
}
