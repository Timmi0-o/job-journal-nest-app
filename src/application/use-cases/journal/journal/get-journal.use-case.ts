import type { IGetJournalDto, IGetJournalResponse } from '@application/dtos/journal/journal';
import type { IJournalValidator } from '@domain/validators/journal/journal';
import { getJournalPresetConfig } from '@shared/presets';
import { EnsureJournalExistsHelper } from './helpers';

export class GetJournalUseCase {
  constructor(
    private readonly validator: IJournalValidator,
    private readonly ensureExistsHelper: EnsureJournalExistsHelper,
  ) {}

  async execute(data: IGetJournalDto): Promise<IGetJournalResponse> {
    const payload = this.validator.validateGetOne(data);
    const presetConfig = getJournalPresetConfig(payload.preset ?? 'BASE');

    return this.ensureExistsHelper.assertExists(payload.id, {
      ...(presetConfig.select?.length ? { select: presetConfig.select } : {}),
      ...(presetConfig.include ? { include: presetConfig.include } : {}),
    });
  }
}
