import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IBaseErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when a feature or operation is not implemented.
 *
 * Use this error for:
 * - Unimplemented methods
 * - Feature not available
 * - Version incompatibility
 * - Deprecated endpoints
 *
 * @example
 * ```typescript
 * throw new NotImplementedError('exportToPdf');
 * throw NotImplementedError.deprecated('v1/users', 'v2/users');
 * ```
 */
export class NotImplementedError extends BaseError {
  /**
   * Feature or method that is not implemented.
   */
  public readonly feature?: string;

  constructor(
    featureOrMessage: string,
    options?: IBaseErrorOptions & {
      feature?: string;
    },
  ) {
    // Determine if featureOrMessage is a feature name or a full message
    const isFeatureName = !featureOrMessage.includes(' ');
    const message = isFeatureName
      ? `Feature '${featureOrMessage}' is not implemented`
      : featureOrMessage;

    super(message, HttpStatus.NOT_IMPLEMENTED, ErrorCodes.NOT_IMPLEMENTED, {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.SYSTEM,
      ...options,
      metadata: {
        ...options?.metadata,
        feature: options?.feature ?? (isFeatureName ? featureOrMessage : undefined),
      },
    });

    this.feature = options?.feature ?? (isFeatureName ? featureOrMessage : undefined);
  }

  /**
   * Create a NotImplementedError for a method.
   */
  static method(
    className: string,
    methodName: string,
    options?: IBaseErrorOptions,
  ): NotImplementedError {
    return new NotImplementedError(`Method '${className}.${methodName}' is not implemented`, {
      ...options,
      feature: `${className}.${methodName}`,
      metadata: {
        ...options?.metadata,
        type: 'METHOD_NOT_IMPLEMENTED',
        className,
        methodName,
      },
    });
  }

  /**
   * Create a NotImplementedError for a deprecated feature.
   */
  static deprecated(
    feature: string,
    alternative?: string,
    options?: IBaseErrorOptions,
  ): NotImplementedError {
    const message = alternative
      ? `Feature '${feature}' is deprecated. Please use '${alternative}' instead`
      : `Feature '${feature}' is deprecated`;

    return new NotImplementedError(message, {
      ...options,
      feature,
      metadata: {
        ...options?.metadata,
        type: 'DEPRECATED',
        alternative,
      },
    });
  }

  /**
   * Create a NotImplementedError for feature not available in current version.
   */
  static versionNotSupported(
    feature: string,
    requiredVersion: string,
    currentVersion?: string,
    options?: IBaseErrorOptions,
  ): NotImplementedError {
    const message = currentVersion
      ? `Feature '${feature}' requires version ${requiredVersion}, current version is ${currentVersion}`
      : `Feature '${feature}' requires version ${requiredVersion}`;

    return new NotImplementedError(message, {
      ...options,
      feature,
      metadata: {
        ...options?.metadata,
        type: 'VERSION_NOT_SUPPORTED',
        requiredVersion,
        currentVersion,
      },
    });
  }

  /**
   * Create a NotImplementedError for feature coming soon.
   */
  static comingSoon(
    feature: string,
    estimatedDate?: Date,
    options?: IBaseErrorOptions,
  ): NotImplementedError {
    const message = estimatedDate
      ? `Feature '${feature}' is coming soon (estimated: ${estimatedDate.toISOString()})`
      : `Feature '${feature}' is coming soon`;

    return new NotImplementedError(message, {
      ...options,
      feature,
      metadata: {
        ...options?.metadata,
        type: 'COMING_SOON',
        estimatedDate: estimatedDate?.toISOString(),
      },
    });
  }

  /**
   * Create a NotImplementedError with a custom message (without technical details).
   *
   * @example
   * ```typescript
   * throw NotImplementedError.withMessage('Эта функция пока недоступна');
   * ```
   */
  static withMessage(message: string, options?: IBaseErrorOptions): NotImplementedError {
    return new NotImplementedError(message, options);
  }
}
