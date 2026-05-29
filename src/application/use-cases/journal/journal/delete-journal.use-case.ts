import type { IDeleteJournalDto, IDeleteJournalResponse } from '@application/dtos/journal/journal';
import type { IJournalRepository } from '@domain/repositories/journal/journal/i-journal.repository';
import type { IJournalValidator } from '@domain/validators/journal/journal';
import { EnsureJournalExistsHelper } from './helpers';

export class DeleteJournalUseCase {
  constructor(
    private readonly validator: IJournalValidator,
    private readonly repository: IJournalRepository,
    private readonly ensureExistsHelper: EnsureJournalExistsHelper,
  ) {}

  async execute(data: IDeleteJournalDto): Promise<IDeleteJournalResponse> {
    const payload = this.validator.validateDelete(data);

    await this.ensureExistsHelper.assertExists(payload.id, { select: ['id'] });
    await this.repository.delete(payload.id);

    return true;
  }
}
