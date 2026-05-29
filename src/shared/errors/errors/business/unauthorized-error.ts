import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IBaseErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when authentication is required but not provided or invalid.
 *
 * Use this error for:
 * - Missing authentication token
 * - Invalid/expired JWT token
 * - Invalid credentials
 * - Session expired
 *
 * Note: Use ForbiddenError when user is authenticated but lacks permission.
 *
 * @example
 * ```typescript
 * throw new UnauthorizedError(); // Default message
 * throw new UnauthorizedError('Invalid token');
 * throw UnauthorizedError.tokenExpired();
 * ```
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Authentication required', options?: IBaseErrorOptions) {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCodes.UNAUTHENTICATED, {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.AUTHENTICATION,
      ...options,
    });
  }

  /**
   * Create an UnauthorizedError for expired token.
   */
  static tokenExpired(options?: IBaseErrorOptions): UnauthorizedError {
    return new UnauthorizedError('Authentication token has expired', {
      ...options,
      metadata: {
        ...options?.metadata,
        reason: 'TOKEN_EXPIRED',
      },
    });
  }

  /**
   * Create an UnauthorizedError for invalid token.
   */
  static tokenInvalid(options?: IBaseErrorOptions): UnauthorizedError {
    return new UnauthorizedError('Authentication token is invalid', {
      ...options,
      metadata: {
        ...options?.metadata,
        reason: 'TOKEN_INVALID',
      },
    });
  }

  /**
   * Create an UnauthorizedError for missing token.
   */
  static tokenMissing(options?: IBaseErrorOptions): UnauthorizedError {
    return new UnauthorizedError('Authentication token is required', {
      ...options,
      metadata: {
        ...options?.metadata,
        reason: 'TOKEN_MISSING',
      },
    });
  }

  /**
   * Create an UnauthorizedError for invalid credentials.
   */
  static invalidCredentials(options?: IBaseErrorOptions): UnauthorizedError {
    return new UnauthorizedError('Invalid credentials', {
      ...options,
      metadata: {
        ...options?.metadata,
        reason: 'INVALID_CREDENTIALS',
      },
    });
  }

  /**
   * Create an UnauthorizedError for expired session.
   */
  static sessionExpired(options?: IBaseErrorOptions): UnauthorizedError {
    return new UnauthorizedError('Session has expired. Please log in again', {
      ...options,
      metadata: {
        ...options?.metadata,
        reason: 'SESSION_EXPIRED',
      },
    });
  }
}
