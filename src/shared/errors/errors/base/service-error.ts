import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IBaseErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from './base-error';

export class ServiceError extends BaseError {
  constructor(
    message: string,
    httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: string = ErrorCodes.INTERNAL_ERROR,
    options?: IBaseErrorOptions,
  ) {
    super(message, httpStatus, errorCode, {
      severity: options?.severity ?? ErrorSeverity.MEDIUM,
      category: options?.category ?? ErrorCategory.GENERAL,
      ...options,
    });
  }
}

export function wrapError(
  error: unknown,
  options?: IBaseErrorOptions & {
    defaultMessage?: string;
  },
): ServiceError {
  if (error instanceof BaseError) {
    return new ServiceError(error.message, error.httpStatus, error.errorCode, {
      severity: error.severity,
      category: error.category,
      metadata: error.metadata,
      context: options?.context
        ? { ...error.context, ...options.context }
        : error.context,
      serviceName: options?.serviceName ?? error.serviceName,
      correlationId: options?.correlationId ?? error.correlationId,
      causedBy: error,
    });
  }

  if (error instanceof Error) {
    return new ServiceError(
      error.message || options?.defaultMessage || 'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INTERNAL_ERROR,
      {
        ...options,
        causedBy: error,
        metadata: {
          ...options?.metadata,
          originalErrorName: error.name,
        },
      },
    );
  }

  const message =
    typeof error === 'string'
      ? error
      : options?.defaultMessage || 'An unexpected error occurred';

  return new ServiceError(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCodes.UNKNOWN_ERROR, {
    ...options,
    metadata: {
      ...options?.metadata,
      originalValue: String(error),
    },
  });
}
