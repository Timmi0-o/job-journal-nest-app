import type {
  ICreateJournalDto,
  IDeleteJournalDto,
  IGetJournalDto,
  IGetJournalsDto,
  IUpdateJournalDto,
} from '@application/dtos/journal/journal';
import type { IJournalValidator } from '@domain/validators/journal/journal';
import { Logger } from '@nestjs/common';
import {
  createJournalSchema,
  deleteJournalSchema,
  getJournalSchema,
  getJournalsSchema,
  updateJournalSchema,
} from '@validators/schemas/journal/journal';
import { ajv, ajvStrict } from '../ajv-instance';
import { BaseValidator } from '../base.validator';

const validateGetOne = ajv.compile(getJournalSchema);
const validateGetMany = ajv.compile(getJournalsSchema);
const validateCreate = ajvStrict.compile(createJournalSchema);
const validateUpdate = ajvStrict.compile(updateJournalSchema);
const validateDelete = ajv.compile(deleteJournalSchema);

export class JournalValidator extends BaseValidator implements IJournalValidator {
  constructor() {
    super(new Logger(JournalValidator.name));
  }

  validateGetOne(data: IGetJournalDto): IGetJournalDto {
    return this.validateAndReturn({
      validate: validateGetOne,
      data,
      errorMessage: 'Произошла ошибка при валидации данных записи журнала',
      logLabel: 'get journal',
    });
  }

  validateGetMany(data: IGetJournalsDto): IGetJournalsDto {
    return this.validateAndReturn({
      validate: validateGetMany,
      data,
      errorMessage: 'Произошла ошибка при валидации списка записей журнала',
      logLabel: 'get journals',
    });
  }

  validateCreate(data: ICreateJournalDto): ICreateJournalDto {
    return this.validateAndReturn({
      validate: validateCreate,
      data,
      errorMessage: 'Произошла ошибка при валидации данных создания записи журнала',
      logLabel: 'create journal',
    });
  }

  validateUpdate(data: IUpdateJournalDto): IUpdateJournalDto {
    return this.validateAndReturn({
      validate: validateUpdate,
      data,
      errorMessage: 'Произошла ошибка при валидации данных обновления записи журнала',
      logLabel: 'update journal',
    });
  }

  validateDelete(data: IDeleteJournalDto): IDeleteJournalDto {
    return this.validateAndReturn({
      validate: validateDelete,
      data,
      errorMessage: 'Произошла ошибка при валидации данных удаления записи журнала',
      logLabel: 'delete journal',
    });
  }
}
