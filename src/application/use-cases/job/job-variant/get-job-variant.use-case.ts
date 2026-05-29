import type {
  IGetJobVariantDto,
  IGetJobVariantResponse,
} from '@application/dtos/job/job-variant';
import type { IJobVariantValidator } from '@domain/validators/job/job-variant';
import { getJobVariantPresetConfig } from '@shared/presets';
import { EnsureJobVariantExistsHelper } from './helpers';

export class GetJobVariantUseCase {
  constructor(
    private readonly validator: IJobVariantValidator,
    private readonly ensureExistsHelper: EnsureJobVariantExistsHelper,
  ) {}

  async execute(data: IGetJobVariantDto): Promise<IGetJobVariantResponse> {
    const payload = this.validator.validateGetOne(data);
    const presetConfig = getJobVariantPresetConfig(payload.preset ?? 'BASE');

    return this.ensureExistsHelper.assertExists(payload.id, {
      ...(presetConfig.select?.length ? { select: presetConfig.select } : {}),
    });
  }
}
