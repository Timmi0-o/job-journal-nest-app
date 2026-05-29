import { LoggerService } from '@nestjs/common';
import { ErrorObject } from 'ajv';
import {
  formatAjvErrors,
  IFormattedValidationErrors,
} from '../helpers/format-ajv-errors';

export abstract class AbstractValidator {
  constructor(protected readonly logger: LoggerService) {}

  protected formatErrors(
    errors: ErrorObject[] | null | undefined,
  ): IFormattedValidationErrors {
    return formatAjvErrors(errors);
  }

  protected logValidationError(
    context: string,
    errors: ErrorObject[] | null | undefined,
  ): void {
    this.logger.error(`Validation failed for ${context}: ${JSON.stringify(errors)}`);
  }
}
