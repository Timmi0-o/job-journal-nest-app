import {
  ICreateJobVariantDto,
  IDeleteJobVariantDto,
  IGetJobVariantDto,
  IGetJobVariantsDto,
  IUpdateJobVariantDto,
} from '@application/dtos/job/job-variant';
import { IEntityValidator } from '@domain/validators/i-entity-validator.interface';

export type IJobVariantValidator = IEntityValidator<
  IGetJobVariantDto,
  IGetJobVariantsDto,
  ICreateJobVariantDto,
  IUpdateJobVariantDto,
  IDeleteJobVariantDto
>;

export const JOB_VARIANT_VALIDATOR_TOKEN = Symbol('JOB_VARIANT_VALIDATOR_TOKEN');
