import type {
  ICreateJobVariantDto,
  IDeleteJobVariantDto,
  IGetJobVariantDto,
  IGetJobVariantsDto,
  IUpdateJobVariantDto,
} from '@application/dtos/job/job-variant';
import type { IJobVariantValidator } from '@domain/validators/job/job-variant';
import { Logger } from '@nestjs/common';
import {
  createJobVariantSchema,
  deleteJobVariantSchema,
  getJobVariantSchema,
  getJobVariantsSchema,
  updateJobVariantSchema,
} from '@validators/schemas/job/job-variant';
import { ajv, ajvStrict } from '../ajv-instance';
import { BaseValidator } from '../base.validator';

const validateGetOne = ajv.compile(getJobVariantSchema);
const validateGetMany = ajv.compile(getJobVariantsSchema);
const validateCreate = ajvStrict.compile(createJobVariantSchema);
const validateUpdate = ajvStrict.compile(updateJobVariantSchema);
const validateDelete = ajv.compile(deleteJobVariantSchema);

export class JobVariantValidator extends BaseValidator implements IJobVariantValidator {
  constructor() {
    super(new Logger(JobVariantValidator.name));
  }

  validateGetOne(data: IGetJobVariantDto): IGetJobVariantDto {
    return this.validateAndReturn({
      validate: validateGetOne,
      data,
      errorMessage: 'Произошла ошибка при валидации данных варианта работы',
      logLabel: 'get job variant',
    });
  }

  validateGetMany(data: IGetJobVariantsDto): IGetJobVariantsDto {
    return this.validateAndReturn({
      validate: validateGetMany,
      data,
      errorMessage: 'Произошла ошибка при валидации списка вариантов работы',
      logLabel: 'get job variants',
    });
  }

  validateCreate(data: ICreateJobVariantDto): ICreateJobVariantDto {
    return this.validateAndReturn({
      validate: validateCreate,
      data,
      errorMessage: 'Произошла ошибка при валидации данных создания варианта работы',
      logLabel: 'create job variant',
    });
  }

  validateUpdate(data: IUpdateJobVariantDto): IUpdateJobVariantDto {
    return this.validateAndReturn({
      validate: validateUpdate,
      data,
      errorMessage: 'Произошла ошибка при валидации данных обновления варианта работы',
      logLabel: 'update job variant',
    });
  }

  validateDelete(data: IDeleteJobVariantDto): IDeleteJobVariantDto {
    return this.validateAndReturn({
      validate: validateDelete,
      data,
      errorMessage: 'Произошла ошибка при валидации данных удаления варианта работы',
      logLabel: 'delete job variant',
    });
  }
}
