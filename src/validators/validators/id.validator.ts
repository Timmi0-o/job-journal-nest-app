import { Logger } from '@nestjs/common';
import { ValidationError } from '@shared/errors';
import { idSchema } from '@shared/schemas';
import { AbstractValidator } from './abstract-validator';
import { ajv } from './ajv-instance';
import { IIdValidator } from './id.validator.interface';

const validateId = ajv.compile(idSchema);

export class IdValidator extends AbstractValidator implements IIdValidator {
  protected readonly logger = new Logger(IdValidator.name);

  validateId(data: string): string {
    if (!validateId(data)) {
      this.logger.error(
        `Validation failed for id: ${JSON.stringify(validateId.errors)}`,
      );
      throw new ValidationError(
        'Произошла ошибка при валидации данных id',
        this.formatErrors(validateId.errors),
      );
    }

    return data;
  }
}
