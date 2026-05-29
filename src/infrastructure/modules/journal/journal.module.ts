import { CreateJournalUseCase } from '@application/use-cases/journal/journal/create-journal.use-case';
import { DeleteJournalUseCase } from '@application/use-cases/journal/journal/delete-journal.use-case';
import { GetJournalUseCase } from '@application/use-cases/journal/journal/get-journal.use-case';
import { GetJournalsUseCase } from '@application/use-cases/journal/journal/get-journals.use-case';
import {
  EnsureJournalExistsHelper,
  JournalWriteHelper,
} from '@application/use-cases/journal/journal/helpers';
import { UpdateJournalUseCase } from '@application/use-cases/journal/journal/update-journal.use-case';
import {
  IUnitRepository,
  UNIT_REPOSITORY_TOKEN,
} from '@domain/repositories/catalog/unit/i-unit.repository';
import {
  IJobVariantRepository,
  JOB_VARIANT_REPOSITORY_TOKEN,
} from '@domain/repositories/job/job-variant/i-job-variant.repository';
import {
  IJournalRepository,
  JOURNAL_REPOSITORY_TOKEN,
} from '@domain/repositories/journal/journal/i-journal.repository';
import {
  IJournalValidator,
  JOURNAL_VALIDATOR_TOKEN,
} from '@domain/validators/journal/journal';
import { Module } from '@nestjs/common';
import { JournalController } from '@presentation/controllers/journal/journal.controller';
import { JournalValidator } from '@validators/validators/journal/journal.validator';
import { UnitModule } from 'src/infrastructure/modules/catalog/unit.module';
import { JobVariantModule } from 'src/infrastructure/modules/job/job-variant.module';
import { JournalRepository } from 'src/infrastructure/persistence/repositories/journal/journal/journal.repository';

@Module({
  imports: [UnitModule, JobVariantModule],
  controllers: [JournalController],
  providers: [
    { provide: JOURNAL_REPOSITORY_TOKEN, useClass: JournalRepository },
    { provide: JOURNAL_VALIDATOR_TOKEN, useClass: JournalValidator },
    {
      provide: EnsureJournalExistsHelper,
      useFactory: (repo: IJournalRepository) =>
        new EnsureJournalExistsHelper(repo),
      inject: [JOURNAL_REPOSITORY_TOKEN],
    },
    {
      provide: JournalWriteHelper,
      useFactory: (
        jobVariantRepo: IJobVariantRepository,
        unitRepo: IUnitRepository,
      ) => new JournalWriteHelper(jobVariantRepo, unitRepo),
      inject: [JOB_VARIANT_REPOSITORY_TOKEN, UNIT_REPOSITORY_TOKEN],
    },
    {
      provide: GetJournalUseCase,
      useFactory: (v: IJournalValidator, h: EnsureJournalExistsHelper) =>
        new GetJournalUseCase(v, h),
      inject: [JOURNAL_VALIDATOR_TOKEN, EnsureJournalExistsHelper],
    },
    {
      provide: GetJournalsUseCase,
      useFactory: (v: IJournalValidator, r: IJournalRepository) =>
        new GetJournalsUseCase(v, r),
      inject: [JOURNAL_VALIDATOR_TOKEN, JOURNAL_REPOSITORY_TOKEN],
    },
    {
      provide: CreateJournalUseCase,
      useFactory: (
        v: IJournalValidator,
        r: IJournalRepository,
        w: JournalWriteHelper,
      ) => new CreateJournalUseCase(v, r, w),
      inject: [JOURNAL_VALIDATOR_TOKEN, JOURNAL_REPOSITORY_TOKEN, JournalWriteHelper],
    },
    {
      provide: UpdateJournalUseCase,
      useFactory: (
        v: IJournalValidator,
        r: IJournalRepository,
        e: EnsureJournalExistsHelper,
        w: JournalWriteHelper,
      ) => new UpdateJournalUseCase(v, r, e, w),
      inject: [
        JOURNAL_VALIDATOR_TOKEN,
        JOURNAL_REPOSITORY_TOKEN,
        EnsureJournalExistsHelper,
        JournalWriteHelper,
      ],
    },
    {
      provide: DeleteJournalUseCase,
      useFactory: (
        v: IJournalValidator,
        r: IJournalRepository,
        e: EnsureJournalExistsHelper,
      ) => new DeleteJournalUseCase(v, r, e),
      inject: [
        JOURNAL_VALIDATOR_TOKEN,
        JOURNAL_REPOSITORY_TOKEN,
        EnsureJournalExistsHelper,
      ],
    },
  ],
})
export class JournalModule {}
