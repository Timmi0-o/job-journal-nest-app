import { CreateJobVariantUseCase } from '@application/use-cases/job/job-variant/create-job-variant.use-case';
import { DeleteJobVariantUseCase } from '@application/use-cases/job/job-variant/delete-job-variant.use-case';
import { GetJobVariantUseCase } from '@application/use-cases/job/job-variant/get-job-variant.use-case';
import { GetJobVariantsUseCase } from '@application/use-cases/job/job-variant/get-job-variants.use-case';
import {
  EnsureJobVariantExistsHelper,
  JobVariantWriteHelper,
} from '@application/use-cases/job/job-variant/helpers';
import { UpdateJobVariantUseCase } from '@application/use-cases/job/job-variant/update-job-variant.use-case';
import {
  IJobVariantRepository,
  JOB_VARIANT_REPOSITORY_TOKEN,
} from '@domain/repositories/job/job-variant/i-job-variant.repository';
import {
  IJobVariantValidator,
  JOB_VARIANT_VALIDATOR_TOKEN,
} from '@domain/validators/job/job-variant';
import { Module } from '@nestjs/common';
import { JobVariantController } from '@presentation/controllers/job/job-variant.controller';
import { JobVariantValidator } from '@validators/validators/job/job-variant.validator';
import { JobVariantRepository } from 'src/infrastructure/persistence/repositories/job/job-variant/job-variant.repository';

@Module({
  controllers: [JobVariantController],
  exports: [JOB_VARIANT_REPOSITORY_TOKEN],
  providers: [
    { provide: JOB_VARIANT_REPOSITORY_TOKEN, useClass: JobVariantRepository },
    { provide: JOB_VARIANT_VALIDATOR_TOKEN, useClass: JobVariantValidator },
    {
      provide: EnsureJobVariantExistsHelper,
      useFactory: (repo: IJobVariantRepository) =>
        new EnsureJobVariantExistsHelper(repo),
      inject: [JOB_VARIANT_REPOSITORY_TOKEN],
    },
    {
      provide: JobVariantWriteHelper,
      useFactory: (repo: IJobVariantRepository) =>
        new JobVariantWriteHelper(repo),
      inject: [JOB_VARIANT_REPOSITORY_TOKEN],
    },
    {
      provide: GetJobVariantUseCase,
      useFactory: (v: IJobVariantValidator, h: EnsureJobVariantExistsHelper) =>
        new GetJobVariantUseCase(v, h),
      inject: [JOB_VARIANT_VALIDATOR_TOKEN, EnsureJobVariantExistsHelper],
    },
    {
      provide: GetJobVariantsUseCase,
      useFactory: (v: IJobVariantValidator, r: IJobVariantRepository) =>
        new GetJobVariantsUseCase(v, r),
      inject: [JOB_VARIANT_VALIDATOR_TOKEN, JOB_VARIANT_REPOSITORY_TOKEN],
    },
    {
      provide: CreateJobVariantUseCase,
      useFactory: (
        v: IJobVariantValidator,
        r: IJobVariantRepository,
        w: JobVariantWriteHelper,
      ) => new CreateJobVariantUseCase(v, r, w),
      inject: [
        JOB_VARIANT_VALIDATOR_TOKEN,
        JOB_VARIANT_REPOSITORY_TOKEN,
        JobVariantWriteHelper,
      ],
    },
    {
      provide: UpdateJobVariantUseCase,
      useFactory: (
        v: IJobVariantValidator,
        r: IJobVariantRepository,
        e: EnsureJobVariantExistsHelper,
        w: JobVariantWriteHelper,
      ) => new UpdateJobVariantUseCase(v, r, e, w),
      inject: [
        JOB_VARIANT_VALIDATOR_TOKEN,
        JOB_VARIANT_REPOSITORY_TOKEN,
        EnsureJobVariantExistsHelper,
        JobVariantWriteHelper,
      ],
    },
    {
      provide: DeleteJobVariantUseCase,
      useFactory: (
        v: IJobVariantValidator,
        r: IJobVariantRepository,
        e: EnsureJobVariantExistsHelper,
      ) => new DeleteJobVariantUseCase(v, r, e),
      inject: [
        JOB_VARIANT_VALIDATOR_TOKEN,
        JOB_VARIANT_REPOSITORY_TOKEN,
        EnsureJobVariantExistsHelper,
      ],
    },
  ],
})
export class JobVariantModule {}
