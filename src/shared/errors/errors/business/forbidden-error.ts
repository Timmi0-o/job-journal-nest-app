import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IBaseErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when user is authenticated but lacks permission.
 *
 * Use this error for:
 * - Insufficient permissions
 * - Role-based access control failures
 * - Resource ownership violations
 * - Feature access restrictions
 *
 * Note: Use UnauthorizedError when authentication is missing or invalid.
 *
 * @example
 * ```typescript
 * throw new ForbiddenError('You do not have permission to delete this resource');
 * throw ForbiddenError.insufficientPermissions(['admin', 'moderator']);
 * throw ForbiddenError.resourceOwnership('Order', orderId);
 * ```
 */
export class ForbiddenError extends BaseError {
  /**
   * Required permissions that were missing.
   */
  public readonly requiredPermissions?: string[];

  /**
   * Required roles that were missing.
   */
  public readonly requiredRoles?: string[];

  /**
   * Resource type that access was denied for.
   */
  public readonly resourceType?: string;

  /**
   * Resource identifier that access was denied for.
   */
  public readonly resourceId?: string | number;

  constructor(
    message: string = 'Access denied',
    options?: IBaseErrorOptions & {
      requiredPermissions?: string[];
      requiredRoles?: string[];
      resourceType?: string;
      resourceId?: string | number;
    },
  ) {
    super(message, HttpStatus.FORBIDDEN, ErrorCodes.FORBIDDEN, {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.AUTHORIZATION,
      ...options,
      metadata: {
        ...options?.metadata,
        requiredPermissions: options?.requiredPermissions,
        requiredRoles: options?.requiredRoles,
        resourceType: options?.resourceType,
        resourceId: options?.resourceId,
      },
    });

    this.requiredPermissions = options?.requiredPermissions;
    this.requiredRoles = options?.requiredRoles;
    this.resourceType = options?.resourceType;
    this.resourceId = options?.resourceId;
  }

  /**
   * Create a ForbiddenError for insufficient permissions.
   */
  static insufficientPermissions(
    requiredPermissions: string[],
    options?: IBaseErrorOptions,
  ): ForbiddenError {
    return new ForbiddenError(
      `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      {
        ...options,
        requiredPermissions,
      },
    );
  }

  /**
   * Create a ForbiddenError for missing roles.
   */
  static missingRoles(requiredRoles: string[], options?: IBaseErrorOptions): ForbiddenError {
    return new ForbiddenError(`Access denied. Required roles: ${requiredRoles.join(', ')}`, {
      ...options,
      requiredRoles,
    });
  }

  /**
   * Create a ForbiddenError for resource ownership violation.
   */
  static resourceOwnership(
    resourceType: string,
    resourceId: string | number,
    options?: IBaseErrorOptions,
  ): ForbiddenError {
    return new ForbiddenError(`You do not have permission to access this ${resourceType}`, {
      ...options,
      resourceType,
      resourceId,
      metadata: {
        ...options?.metadata,
        reason: 'RESOURCE_OWNERSHIP',
      },
    });
  }

  /**
   * Create a ForbiddenError for feature access restriction.
   */
  static featureRestricted(feature: string, options?: IBaseErrorOptions): ForbiddenError {
    return new ForbiddenError(`Access to ${feature} is restricted`, {
      ...options,
      metadata: {
        ...options?.metadata,
        feature,
        reason: 'FEATURE_RESTRICTED',
      },
    });
  }

  /**
   * Create a ForbiddenError for operation not allowed.
   */
  static operationNotAllowed(operation: string, options?: IBaseErrorOptions): ForbiddenError {
    return new ForbiddenError(`Operation '${operation}' is not allowed`, {
      ...options,
      metadata: {
        ...options?.metadata,
        operation,
        reason: 'OPERATION_NOT_ALLOWED',
      },
    });
  }
}
