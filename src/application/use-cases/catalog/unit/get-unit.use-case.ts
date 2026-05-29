import type {
  IGetUnitDto,
  IGetUnitResponse,
} from '@application/dtos/catalog/unit';
import type { IUnitValidator } from '@domain/validators/catalog/unit';
import { getUnitPresetConfig } from '@shared/presets';
import { EnsureUnitExistsHelper } from './helpers';

export class GetUnitUseCase {
  constructor(
    private readonly validator: IUnitValidator,
    private readonly ensureExistsHelper: EnsureUnitExistsHelper,
  ) {}

  async execute(data: IGetUnitDto): Promise<IGetUnitResponse> {
    const payload = this.validator.validateGetOne(data);
    const presetConfig = getUnitPresetConfig(payload.preset ?? 'BASE');

    return this.ensureExistsHelper.assertExists(payload.id, {
      ...(presetConfig.select?.length ? { select: presetConfig.select } : {}),
    });
  }
}
