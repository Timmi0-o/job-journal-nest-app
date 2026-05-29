import { Logger, LoggerService } from '@nestjs/common';
import { AbstractValidator } from './abstract-validator';
import { ValidationError } from '@shared/errors';
import { ValidateFunction } from 'ajv';

export abstract class BaseValidator extends AbstractValidator {
  constructor(logger?: LoggerService) {
    super(logger ?? new Logger(BaseValidator.name));
  }

  protected validateAndReturn<T>(params: {
    validate: ValidateFunction;
    data: T;
    errorMessage: string;
    logLabel: string;
    dataForSchema?: unknown;
  }): T {
    const { validate, data, errorMessage, logLabel, dataForSchema } = params;

    if (!validate(dataForSchema ?? data)) {
      this.logValidationError(logLabel, validate.errors);
      throw new ValidationError(errorMessage, this.formatErrors(validate.errors));
    }

    return data;
  }
}
