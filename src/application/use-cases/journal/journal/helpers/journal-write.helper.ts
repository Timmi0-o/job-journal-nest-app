import type { ICreateJournalInput, IUpdateJournalInput } from '@domain/entities/journal/journal/i-journal.entity';
import type { IJobVariantRepository } from '@domain/repositories/job/job-variant/i-job-variant.repository';
import type { IUnitRepository } from '@domain/repositories/catalog/unit/i-unit.repository';
import { Logger } from '@nestjs/common';
import { NotFoundError } from '@shared/errors/errors/business/not-found-error';

export class JournalWriteHelper {
  private readonly logger = new Logger(JournalWriteHelper.name);

  constructor(
    private readonly jobVariantRepository: IJobVariantRepository,
    private readonly unitRepository: IUnitRepository,
  ) {}

  async assertRelationsExist(input: ICreateJournalInput | IUpdateJournalInput): Promise<void> {
    if (input.jobVariantId != null) {
      const jobVariant = await this.jobVariantRepository.findOne(input.jobVariantId, {
        select: ['id'],
      });
      if (jobVariant == null) {
        this.logger.warn(`JobVariant not found for journal: id=${input.jobVariantId}`);
        throw NotFoundError.withMessage('Вариант работы не найден', {
          resourceId: input.jobVariantId,
        });
      }
    }

    if (input.unitId != null) {
      const unit = await this.unitRepository.findOne(input.unitId, { select: ['id'] });
      if (unit == null) {
        this.logger.warn(`Unit not found for journal: id=${input.unitId}`);
        throw NotFoundError.withMessage('Единица измерения не найдена', {
          resourceId: input.unitId,
        });
      }
    }
  }
}
