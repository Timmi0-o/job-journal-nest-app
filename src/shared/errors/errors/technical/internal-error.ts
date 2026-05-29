import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IBaseErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown for internal server errors.
 *
 * Use this error for:
 * - Unexpected exceptions
 * - System failures
 * - Programming errors (bugs)
 * - Unhandled edge cases
 *
 * @example
 * ```typescript
 * throw new InternalError('Failed to process request');
 * throw InternalError.fromError(caughtError, 'Error while processing payment');
 * ```
 */
export class InternalError extends BaseError {
  constructor(message: string = 'An internal error occurred', options?: IBaseErrorOptions) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCodes.INTERNAL_ERROR, {
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.SYSTEM,
      ...options,
    });
  }

  /**
   * Create an InternalError from an unknown error.
   */
  static fromError(error: unknown, context?: string, options?: IBaseErrorOptions): InternalError {
    let message = context ?? 'An internal error occurred';
    let causedBy: Error | undefined;

    if (error instanceof Error) {
      causedBy = error;
      message = context ? `${context}: ${error.message}` : error.message;
    } else if (typeof error === 'string') {
      message = context ? `${context}: ${error}` : error;
    }

    return new InternalError(message, {
      ...options,
      causedBy,
      metadata: {
        ...options?.metadata,
        originalErrorType: error instanceof Error ? error.constructor.name : typeof error,
      },
    });
  }

  /**
   * Create an InternalError for configuration issues.
   */
  static configuration(message: string, options?: IBaseErrorOptions): InternalError {
    return new InternalError(message, {
      ...options,
      category: ErrorCategory.CONFIGURATION,
      metadata: {
        ...options?.metadata,
        type: 'CONFIGURATION_ERROR',
      },
    });
  }

  /**
   * Create an InternalError for initialization failures.
   */
  static initialization(component: string, options?: IBaseErrorOptions): InternalError {
    return new InternalError(`Failed to initialize ${component}`, {
      ...options,
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.CRITICAL,
      metadata: {
        ...options?.metadata,
        type: 'INITIALIZATION_ERROR',
        component,
      },
    });
  }

  /**
   * Create an InternalError for unexpected state.
   */
  static unexpectedState(description: string, options?: IBaseErrorOptions): InternalError {
    return new InternalError(`Unexpected state: ${description}`, {
      ...options,
      metadata: {
        ...options?.metadata,
        type: 'UNEXPECTED_STATE',
      },
    });
  }

  /**
   * Create an InternalError with a custom error code.
   */
  static withCode(message: string, errorCode: string, options?: IBaseErrorOptions): InternalError {
    const error = new InternalError(message, options);
    // Override the errorCode
    return Object.assign(Object.create(InternalError.prototype), {
      ...error,
      errorCode,
    });
  }
}
