import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IBaseErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when rate limit is exceeded.
 *
 * Use this error for:
 * - API rate limiting
 * - User quota exceeded
 * - Resource exhaustion
 * - Throttling
 *
 * @example
 * ```typescript
 * throw new RateLimitError(60); // Retry after 60 seconds
 * throw RateLimitError.quotaExceeded('API calls', 1000, 'day');
 * ```
 */
export class RateLimitError extends BaseError {
  /**
   * Seconds until the rate limit resets.
   */
  public readonly retryAfterSeconds?: number;

  /**
   * Current request count.
   */
  public readonly currentCount?: number;

  /**
   * Maximum allowed requests.
   */
  public readonly maxRequests?: number;

  /**
   * Time window for the limit.
   */
  public readonly timeWindow?: string;

  constructor(
    retryAfterSeconds?: number,
    options?: IBaseErrorOptions & {
      currentCount?: number;
      maxRequests?: number;
      timeWindow?: string;
    },
  ) {
    const message = retryAfterSeconds
      ? `Rate limit exceeded. Please retry after ${retryAfterSeconds} seconds`
      : 'Rate limit exceeded';

    super(message, HttpStatus.TOO_MANY_REQUESTS, ErrorCodes.RATE_LIMITED, {
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.RESOURCE,
      isRetriable: true,
      ...options,
      metadata: {
        ...options?.metadata,
        retryAfterSeconds,
        currentCount: options?.currentCount,
        maxRequests: options?.maxRequests,
        timeWindow: options?.timeWindow,
      },
    });

    this.retryAfterSeconds = retryAfterSeconds;
    this.currentCount = options?.currentCount;
    this.maxRequests = options?.maxRequests;
    this.timeWindow = options?.timeWindow;
  }

  /**
   * Create a RateLimitError for quota exceeded.
   */
  static quotaExceeded(
    resource: string,
    limit: number,
    period: 'second' | 'minute' | 'hour' | 'day' | 'month',
    options?: IBaseErrorOptions,
  ): RateLimitError {
    return new RateLimitError(undefined, {
      ...options,
      maxRequests: limit,
      timeWindow: period,
      metadata: {
        ...options?.metadata,
        type: 'QUOTA_EXCEEDED',
        resource,
        limit,
        period,
      },
    });
  }

  /**
   * Create a RateLimitError with full details.
   */
  static withDetails(
    currentCount: number,
    maxRequests: number,
    timeWindow: string,
    retryAfterSeconds?: number,
    options?: IBaseErrorOptions,
  ): RateLimitError {
    return new RateLimitError(retryAfterSeconds, {
      ...options,
      currentCount,
      maxRequests,
      timeWindow,
    });
  }

  /**
   * Create a RateLimitError for too many requests.
   */
  static tooManyRequests(
    retryAfterSeconds: number,
    options?: IBaseErrorOptions,
  ): RateLimitError {
    return new RateLimitError(retryAfterSeconds, {
      ...options,
      metadata: {
        ...options?.metadata,
        type: 'TOO_MANY_REQUESTS',
      },
    });
  }

  /**
   * Create a RateLimitError for resource exhaustion.
   */
  static resourceExhausted(
    resource: string,
    options?: IBaseErrorOptions,
  ): RateLimitError {
    const error = new RateLimitError(undefined, {
      ...options,
      severity: ErrorSeverity.HIGH,
      metadata: {
        ...options?.metadata,
        type: 'RESOURCE_EXHAUSTED',
        resource,
      },
    });

    // Override message
    Object.defineProperty(error, 'message', {
      value: `Resource '${resource}' has been exhausted`,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    return error;
  }

  /**
   * Create a RateLimitError with a custom message (without technical details).
   *
   * @example
   * ```typescript
   * throw RateLimitError.withMessage('Слишком много запросов, попробуйте позже');
   * ```
   */
  static withMessage(message: string, options?: IBaseErrorOptions): RateLimitError {
    const error = new RateLimitError(undefined, options);
    Object.defineProperty(error, 'message', {
      value: message,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    return error;
  }
}
