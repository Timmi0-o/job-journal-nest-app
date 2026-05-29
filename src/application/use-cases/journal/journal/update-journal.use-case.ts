import type { IUpdateJournalDto, IUpdateJournalResponse } from '@application/dtos/journal/journal';
import type { IJournalRepository } from '@domain/repositories/journal/journal/i-journal.repository';
import type { IJournalValidator } from '@domain/validators/journal/journal';
import {
  EnsureJournalExistsHelper,
  JournalWriteHelper,
  mapUpdateJournalDtoToInput,
} from './helpers';

export class UpdateJournalUseCase {
  constructor(
    private readonly validator: IJournalValidator,
    private readonly repository: IJournalRepository,
    private readonly ensureExistsHelper: EnsureJournalExistsHelper,
    private readonly writeHelper: JournalWriteHelper,
  ) {}

  async execute(data: IUpdateJournalDto): Promise<IUpdateJournalResponse> {
    const payload = this.validator.validateUpdate(data);
    const { id } = payload;
    const update = mapUpdateJournalDtoToInput(payload);

    await this.ensureExistsHelper.assertExists(id, { select: ['id'] });
    await this.writeHelper.assertRelationsExist(update);

    return this.repository.update(id, update);
  }
}
