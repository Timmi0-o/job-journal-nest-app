import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IServiceUnavailableErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when a service is unavailable.
 *
 * Use this error for:
 * - Microservice unreachable
 * - External service down
 * - Database connection failed
 * - Circuit breaker open
 *
 * @example
 * ```typescript
 * throw new ServiceUnavailableError('user-service');
 * throw ServiceUnavailableError.circuitBreakerOpen('payment-service');
 * throw ServiceUnavailableError.withRetryAfter('api-gateway', 30);
 * ```
 */
export class ServiceUnavailableError extends BaseError {
  /**
   * Name of the unavailable service.
   */
  public readonly targetService: string;

  /**
   * Suggested retry time in seconds.
   */
  public readonly retryAfter?: number;

  constructor(
    targetService: string,
    message?: string,
    options?: IServiceUnavailableErrorOptions,
  ) {
    super(
      message ?? `Service '${targetService}' is currently unavailable`,
      HttpStatus.SERVICE_UNAVAILABLE,
      ErrorCodes.SERVICE_UNAVAILABLE,
      {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.EXTERNAL_SERVICE,
        isRetriable: true,
        ...options,
        metadata: {
          ...options?.metadata,
          targetService,
          retryAfter: options?.retryAfter,
        },
      },
    );

    this.targetService = targetService;
    this.retryAfter = options?.retryAfter;
  }

  /**
   * Create a ServiceUnavailableError with retry-after header.
   */
  static withRetryAfter(
    targetService: string,
    retryAfterSeconds: number,
    options?: Omit<IServiceUnavailableErrorOptions, 'targetService' | 'retryAfter'>,
  ): ServiceUnavailableError {
    return new ServiceUnavailableError(
      targetService,
      `Service '${targetService}' is currently unavailable. Please retry after ${retryAfterSeconds} seconds`,
      {
        ...options,
        retryAfter: retryAfterSeconds,
      },
    );
  }

  /**
   * Create a ServiceUnavailableError for circuit breaker open state.
   */
  static circuitBreakerOpen(
    targetService: string,
    options?: Omit<IServiceUnavailableErrorOptions, 'targetService'>,
  ): ServiceUnavailableError {
    return new ServiceUnavailableError(
      targetService,
      `Circuit breaker is open for service '${targetService}'`,
      {
        ...options,
        metadata: {
          ...options?.metadata,
          reason: 'CIRCUIT_BREAKER_OPEN',
        },
      },
    );
  }

  /**
   * Create a ServiceUnavailableError for connection failure.
   */
  static connectionFailed(
    targetService: string,
    options?: Omit<IServiceUnavailableErrorOptions, 'targetService'>,
  ): ServiceUnavailableError {
    return new ServiceUnavailableError(
      targetService,
      `Failed to connect to service '${targetService}'`,
      {
        ...options,
        category: ErrorCategory.NETWORK,
        metadata: {
          ...options?.metadata,
          reason: 'CONNECTION_FAILED',
        },
      },
    );
  }

  /**
   * Create a ServiceUnavailableError for maintenance mode.
   */
  static maintenance(
    targetService: string,
    estimatedEndTime?: Date,
    options?: Omit<IServiceUnavailableErrorOptions, 'targetService'>,
  ): ServiceUnavailableError {
    const message = estimatedEndTime
      ? `Service '${targetService}' is under maintenance until ${estimatedEndTime.toISOString()}`
      : `Service '${targetService}' is under maintenance`;

    return new ServiceUnavailableError(targetService, message, {
      ...options,
      metadata: {
        ...options?.metadata,
        reason: 'MAINTENANCE',
        estimatedEndTime: estimatedEndTime?.toISOString(),
      },
    });
  }

  /**
   * Create a ServiceUnavailableError for overload.
   */
  static overloaded(
    targetService: string,
    options?: Omit<IServiceUnavailableErrorOptions, 'targetService'>,
  ): ServiceUnavailableError {
    return new ServiceUnavailableError(
      targetService,
      `Service '${targetService}' is currently overloaded`,
      {
        ...options,
        metadata: {
          ...options?.metadata,
          reason: 'OVERLOADED',
        },
      },
    );
  }

  /**
   * Create a ServiceUnavailableError with a custom message (without technical details).
   *
   * @example
   * ```typescript
   * throw ServiceUnavailableError.withMessage('Сервис временно недоступен');
   * ```
   */
  static withMessage(
    message: string,
    options?: IServiceUnavailableErrorOptions,
  ): ServiceUnavailableError {
    const error = new ServiceUnavailableError('service', message, options);
    return error;
  }
}
