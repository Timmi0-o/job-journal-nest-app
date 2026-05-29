import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IValidationErrorDetails } from '../../interfaces/error-metadata.interface';
import { IValidationErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when input validation fails.
 *
 * Use this error for:
 * - Invalid request parameters
 * - Schema validation failures
 * - DTO validation errors
 * - Format violations
 *
 * @example
 * ```typescript
 * throw new ValidationError('Invalid user data', {
 *   validationErrors: {
 *     email: ['Email format is invalid', 'Email is required'],
 *     age: ['Age must be a positive number'],
 *   },
 * });
 * ```
 */
export class ValidationError extends BaseError {
  /**
   * Detailed validation errors by field.
   */
  public readonly validationErrors: IValidationErrorDetails;

  constructor(
    message: string = 'Validation failed',
    options?: IValidationErrorOptions | IValidationErrorDetails,
  ) {
    const normalized = normalizeValidationOptions(options);

    super(message, HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR, {
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.VALIDATION,
      ...normalized,
      metadata: {
        ...normalized.metadata,
        validationErrors: normalized.validationErrors,
      },
    });

    this.validationErrors = normalized.validationErrors ?? {};
  }

  /**
   * Check if a specific field has validation errors.
   */
  public hasFieldError(field: string): boolean {
    return field in this.validationErrors && this.validationErrors[field].length > 0;
  }

  /**
   * Get validation errors for a specific field.
   */
  public getFieldErrors(field: string): string[] {
    return this.validationErrors[field] ?? [];
  }

  /**
   * Get all field names that have errors.
   */
  public getErrorFields(): string[] {
    return Object.keys(this.validationErrors).filter(
      (field) => this.validationErrors[field].length > 0,
    );
  }

  /**
   * Get total number of validation errors.
   */
  public getErrorCount(): number {
    return Object.values(this.validationErrors).reduce((count, errors) => count + errors.length, 0);
  }

  /**
   * Create a ValidationError from class-validator errors.
   */
  static fromClassValidator(
    errors: Array<{
      property: string;
      constraints?: Record<string, string>;
    }>,
    options?: Omit<IValidationErrorOptions, 'validationErrors'>,
  ): ValidationError {
    const validationErrors: IValidationErrorDetails = {};

    for (const error of errors) {
      validationErrors[error.property] = error.constraints
        ? Object.values(error.constraints)
        : ['Invalid value'];
    }

    const fieldCount = Object.keys(validationErrors).length;
    const message =
      fieldCount === 1
        ? `Validation failed for field: ${Object.keys(validationErrors)[0]}`
        : `Validation failed for ${fieldCount} fields`;

    return new ValidationError(message, {
      ...options,
      validationErrors,
    });
  }

  /**
   * Create a single field validation error.
   */
  static forField(
    field: string,
    errors: string | string[],
    options?: Omit<IValidationErrorOptions, 'validationErrors'>,
  ): ValidationError {
    const errorMessages = Array.isArray(errors) ? errors : [errors];
    return new ValidationError(`Validation failed for field: ${field}`, {
      ...options,
      validationErrors: { [field]: errorMessages },
    });
  }
}

function normalizeValidationOptions(
  options?: IValidationErrorOptions | IValidationErrorDetails,
): IValidationErrorOptions {
  if (!options) {
    return {};
  }

  if (
    'validationErrors' in options ||
    'severity' in options ||
    'category' in options ||
    'metadata' in options ||
    'context' in options ||
    'serviceName' in options ||
    'correlationId' in options ||
    'causedBy' in options ||
    'isRetriable' in options
  ) {
    return options;
  }

  return { validationErrors: options as IValidationErrorDetails };
}
