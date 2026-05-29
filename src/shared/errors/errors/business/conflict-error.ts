import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IConflictErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when a resource conflict occurs.
 *
 * Use this error for:
 * - Duplicate entries
 * - Unique constraint violations
 * - Concurrent modification conflicts
 * - Version conflicts (optimistic locking)
 *
 * @example
 * ```typescript
 * throw new ConflictError('User with this email already exists', {
 *   resourceType: 'User',
 *   conflictingField: 'email',
 *   conflictingValue: 'test@example.com',
 * });
 * ```
 */
export class ConflictError extends BaseError {
  /**
   * Type of resource that conflicts.
   */
  public readonly resourceType?: string;

  /**
   * Resource identifier if available.
   */
  public readonly resourceId?: string | number;

  /**
   * Field that caused the conflict.
   */
  public readonly conflictingField?: string;

  /**
   * Value that caused the conflict.
   */
  public readonly conflictingValue?: unknown;

  constructor(message: string, options?: IConflictErrorOptions) {
    super(message, HttpStatus.CONFLICT, ErrorCodes.CONFLICT, {
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.BUSINESS_LOGIC,
      ...options,
      metadata: {
        ...options?.metadata,
        resourceType: options?.resourceType,
        resourceId: options?.resourceId,
        conflictingField: options?.conflictingField,
        conflictingValue: options?.conflictingValue,
      },
    });

    this.resourceType = options?.resourceType;
    this.resourceId = options?.resourceId;
    this.conflictingField = options?.conflictingField;
    this.conflictingValue = options?.conflictingValue;
  }

  /**
   * Create a ConflictError for a duplicate resource.
   */
  static duplicate(
    resourceType: string,
    field: string,
    value: unknown,
    options?: Omit<IConflictErrorOptions, 'resourceType' | 'conflictingField' | 'conflictingValue'>,
  ): ConflictError {
    return new ConflictError(`${resourceType} with ${field} '${String(value)}' already exists`, {
      ...options,
      resourceType,
      conflictingField: field,
      conflictingValue: value,
    });
  }

  /**
   * Create a ConflictError for a version conflict (optimistic locking).
   */
  static versionConflict(
    resourceType: string,
    resourceId: string | number,
    options?: Omit<IConflictErrorOptions, 'resourceType' | 'resourceId'>,
  ): ConflictError {
    return new ConflictError(
      `${resourceType} '${resourceId}' has been modified. Please refresh and try again`,
      {
        ...options,
        resourceType,
        resourceId,
        metadata: {
          ...options?.metadata,
          conflictType: 'VERSION_CONFLICT',
        },
      },
    );
  }

  /**
   * Create a ConflictError for a concurrent modification.
   */
  static concurrentModification(
    resourceType: string,
    resourceId: string | number,
    options?: Omit<IConflictErrorOptions, 'resourceType' | 'resourceId'>,
  ): ConflictError {
    return new ConflictError(
      `${resourceType} '${resourceId}' is being modified by another operation`,
      {
        ...options,
        resourceType,
        resourceId,
        metadata: {
          ...options?.metadata,
          conflictType: 'CONCURRENT_MODIFICATION',
        },
      },
    );
  }
}
