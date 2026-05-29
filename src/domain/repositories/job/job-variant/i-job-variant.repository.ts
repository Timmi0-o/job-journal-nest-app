import {
  ICreateJobVariantInput,
  IJobVariantEntity,
  IUpdateJobVariantInput,
} from '@domain/entities/job/job-variant/i-job-variant.entity';
import { ICommonRepository } from '@domain/repositories/i-common.repository';

export const JOB_VARIANT_REPOSITORY_TOKEN = Symbol(
  'JOB_VARIANT_REPOSITORY_TOKEN',
);

export interface IJobVariantRepository extends ICommonRepository<
  IJobVariantEntity,
  ICreateJobVariantInput,
  IUpdateJobVariantInput,
  undefined
> {
  findOneByName(name: string): Promise<IJobVariantEntity | null>;
}
