import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { INotFoundErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Extended options for NotFoundError with custom message support.
 */
export interface INotFoundErrorExtendedOptions extends INotFoundErrorOptions {
  /**
   * Custom message to show to client.
   * If provided, overrides auto-generated message.
   */
  message?: string;
}

/**
 * Error thrown when a requested resource is not found.
 *
 * Use this error for:
 * - Database record not found
 * - API resource not found
 * - File not found
 * - Missing configuration
 *
 * @example
 * ```typescript
 * // Auto-generated message
 * throw new NotFoundError('User', userId);
 * // Result: "User with identifier '123' not found"
 *
 * // Custom message for client
 * throw new NotFoundError('User', userId, {
 *   message: 'Пользователь не найден',
 * });
 *
 * // Multiple resources
 * throw NotFoundError.withMessage('Пользователи не найдены', {
 *   metadata: { userIds: ['id1', 'id2'] }
 * });
 * ```
 */
export class NotFoundError extends BaseError {
  /**
   * Type of resource that was not found.
   */
  public readonly resourceType?: string;

  /**
   * Identifier of the resource (if available).
   */
  public readonly resourceId?: string | number;

  constructor(
    resourceType: string,
    resourceId?: string | number,
    options?: INotFoundErrorExtendedOptions,
  ) {
    // Use custom message if provided, otherwise generate default
    const message =
      options?.message ??
      (resourceId
        ? `${resourceType} with identifier '${resourceId}' not found`
        : `${resourceType} not found`);

    super(message, HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND, {
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.BUSINESS_LOGIC,
      ...options,
      metadata: {
        ...options?.metadata,
        resourceType,
        resourceId,
      },
    });

    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  /**
   * Create a NotFoundError for a specific entity type.
   */
  static forEntity(
    entityName: string,
    id: string | number,
    options?: INotFoundErrorExtendedOptions,
  ): NotFoundError {
    return new NotFoundError(entityName, id, options);
  }

  /**
   * Create a NotFoundError for a user.
   */
  static forUser(userId: string | number, options?: INotFoundErrorExtendedOptions): NotFoundError {
    return new NotFoundError('User', userId, options);
  }

  /**
   * Create a NotFoundError with custom message (recommended for client-facing messages).
   *
   * @example
   * ```typescript
   * throw NotFoundError.withMessage('Пользователи не найдены', {
   *   metadata: { userIds: ['id1', 'id2'] }
   * });
   * ```
   */
  static withMessage(message: string, options?: INotFoundErrorOptions): NotFoundError {
    return new NotFoundError('Resource', undefined, {
      ...options,
      message,
    });
  }

  /**
   * Create a NotFoundError for multiple resources.
   *
   * @example
   * ```typescript
   * throw NotFoundError.forMany('User', ['id1', 'id2'], {
   *   message: 'Некоторые пользователи не найдены'
   * });
   * ```
   */
  static forMany(
    resourceType: string,
    ids: (string | number)[],
    options?: INotFoundErrorExtendedOptions,
  ): NotFoundError {
    const message = options?.message ?? `${resourceType}s not found`;
    return new NotFoundError(resourceType, undefined, {
      ...options,
      message,
      metadata: {
        ...options?.metadata,
        resourceIds: ids,
      },
    });
  }
}
