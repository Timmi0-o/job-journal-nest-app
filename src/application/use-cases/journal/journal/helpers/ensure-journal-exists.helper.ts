import type { IJournalRepository } from '@domain/repositories/journal/journal/i-journal.repository';
import { Logger } from '@nestjs/common';
import { NotFoundError } from '@shared/errors/errors/business/not-found-error';

type IFindOneOptions = Parameters<IJournalRepository['findOne']>[1];

export class EnsureJournalExistsHelper {
  private readonly logger = new Logger(EnsureJournalExistsHelper.name);

  constructor(private readonly repository: IJournalRepository) {}

  async assertExists(
    id: string,
    options?: IFindOneOptions,
  ): Promise<NonNullable<Awaited<ReturnType<IJournalRepository['findOne']>>>> {
    const entity = await this.repository.findOne(id, options);

    if (entity == null) {
      this.logger.warn(`Journal not found: id=${id}`);
      throw NotFoundError.withMessage('Запись журнала не найдена', { resourceId: id });
    }

    return entity;
  }
}
