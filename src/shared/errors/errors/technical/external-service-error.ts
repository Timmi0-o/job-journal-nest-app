import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IExternalServiceErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when an external service call fails.
 *
 * Use this error for:
 * - Third-party API failures
 * - External microservice errors
 * - Webhook delivery failures
 * - Partner service issues
 *
 * @example
 * ```typescript
 * throw new ExternalServiceError('payment-gateway', 'Payment failed', 502);
 * throw ExternalServiceError.httpError('stripe-api', 400, { error: 'Invalid card' });
 * ```
 */
export class ExternalServiceError extends BaseError {
  /**
   * Name of the external service.
   */
  public readonly externalServiceName: string;

  /**
   * Endpoint that was called.
   */
  public readonly endpoint?: string;

  /**
   * HTTP status code from external service.
   */
  public readonly statusCode?: number;

  /**
   * Response from external service.
   */
  public readonly response?: unknown;

  constructor(
    serviceName: string,
    message?: string,
    statusCode?: number,
    options?: IExternalServiceErrorOptions,
  ) {
    const httpStatus = ExternalServiceError.resolveHttpStatus(statusCode);

    super(
      message ?? `External service '${serviceName}' call failed`,
      httpStatus,
      ErrorCodes.EXTERNAL_SERVICE_ERROR,
      {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.EXTERNAL_SERVICE,
        ...options,
        metadata: {
          ...options?.metadata,
          serviceName,
          endpoint: options?.endpoint,
          statusCode,
          response: options?.response,
        },
      },
    );

    this.externalServiceName = serviceName;
    this.endpoint = options?.endpoint;
    this.statusCode = statusCode;
    this.response = options?.response;
  }

  private static resolveHttpStatus(statusCode?: number): number {
    if (!statusCode) return HttpStatus.BAD_GATEWAY;

    if (statusCode >= 200 && statusCode < 300) return HttpStatus.OK;
    if (statusCode === 400) return HttpStatus.BAD_REQUEST;
    if (statusCode === 401) return HttpStatus.UNAUTHORIZED;
    if (statusCode === 403) return HttpStatus.FORBIDDEN;
    if (statusCode === 404) return HttpStatus.NOT_FOUND;
    if (statusCode === 409) return HttpStatus.CONFLICT;
    if (statusCode === 429) return HttpStatus.TOO_MANY_REQUESTS;
    if (statusCode >= 400 && statusCode < 500) return HttpStatus.PRECONDITION_FAILED;
    if (statusCode === 501) return HttpStatus.NOT_IMPLEMENTED;
    if (statusCode === 503) return HttpStatus.SERVICE_UNAVAILABLE;
    if (statusCode === 504) return HttpStatus.GATEWAY_TIMEOUT;
    if (statusCode >= 500) return HttpStatus.INTERNAL_SERVER_ERROR;

    return HttpStatus.BAD_GATEWAY;
  }

  /**
   * Create an ExternalServiceError from HTTP error response.
   */
  static httpError(
    serviceName: string,
    statusCode: number,
    response?: unknown,
    options?: Omit<IExternalServiceErrorOptions, 'statusCode' | 'response'>,
  ): ExternalServiceError {
    const message = `External service '${serviceName}' returned HTTP ${statusCode}`;
    return new ExternalServiceError(serviceName, message, statusCode, {
      ...options,
      response,
    });
  }

  /**
   * Create an ExternalServiceError for network failure.
   */
  static networkError(
    serviceName: string,
    endpoint?: string,
    options?: Omit<IExternalServiceErrorOptions, 'serviceName' | 'endpoint'>,
  ): ExternalServiceError {
    return new ExternalServiceError(
      serviceName,
      `Network error while calling '${serviceName}'${endpoint ? ` at ${endpoint}` : ''}`,
      undefined,
      {
        ...options,
        endpoint,
        category: ErrorCategory.NETWORK,
        metadata: {
          ...options?.metadata,
          type: 'NETWORK_ERROR',
        },
      },
    );
  }

  /**
   * Create an ExternalServiceError for rate limiting.
   */
  static rateLimited(
    serviceName: string,
    retryAfterSeconds?: number,
    options?: Omit<IExternalServiceErrorOptions, 'serviceName'>,
  ): ExternalServiceError {
    const message = retryAfterSeconds
      ? `Rate limited by '${serviceName}'. Retry after ${retryAfterSeconds} seconds`
      : `Rate limited by '${serviceName}'`;

    return new ExternalServiceError(serviceName, message, 429, {
      ...options,
      isRetriable: true,
      metadata: {
        ...options?.metadata,
        type: 'RATE_LIMITED',
        retryAfterSeconds,
      },
    });
  }

  /**
   * Create an ExternalServiceError for authentication failure.
   */
  static authenticationFailed(
    serviceName: string,
    options?: Omit<IExternalServiceErrorOptions, 'serviceName'>,
  ): ExternalServiceError {
    return new ExternalServiceError(
      serviceName,
      `Authentication failed with '${serviceName}'`,
      401,
      {
        ...options,
        metadata: {
          ...options?.metadata,
          type: 'AUTHENTICATION_FAILED',
        },
      },
    );
  }

  /**
   * Create an ExternalServiceError for invalid response.
   */
  static invalidResponse(
    serviceName: string,
    reason?: string,
    options?: Omit<IExternalServiceErrorOptions, 'serviceName'>,
  ): ExternalServiceError {
    const message = reason
      ? `Invalid response from '${serviceName}': ${reason}`
      : `Invalid response from '${serviceName}'`;

    return new ExternalServiceError(serviceName, message, undefined, {
      ...options,
      category: ErrorCategory.SERIALIZATION,
      metadata: {
        ...options?.metadata,
        type: 'INVALID_RESPONSE',
        reason,
      },
    });
  }

  /**
   * Create an ExternalServiceError with a custom message (without technical details).
   *
   * @example
   * ```typescript
   * throw ExternalServiceError.withMessage('Ошибка при получении данных', {
   *   metadata: { endpoint: '/users' }
   * });
   * ```
   */
  static withMessage(
    message: string,
    options?: IExternalServiceErrorOptions,
  ): ExternalServiceError {
    const error = new ExternalServiceError(
      'external-service',
      message,
      undefined,
      options,
    );
    // Update metadata to not include default serviceName
    return error;
  }
}
