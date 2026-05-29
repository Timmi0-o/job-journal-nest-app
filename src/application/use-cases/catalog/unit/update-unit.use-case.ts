import type { IUpdateUnitDto, IUpdateUnitResponse } from '@application/dtos/catalog/unit';
import type { IUnitRepository } from '@domain/repositories/catalog/unit/i-unit.repository';
import type { IUnitValidator } from '@domain/validators/catalog/unit';
import { EnsureUnitExistsHelper, UnitWriteHelper } from './helpers';

export class UpdateUnitUseCase {
  constructor(
    private readonly validator: IUnitValidator,
    private readonly repository: IUnitRepository,
    private readonly ensureExistsHelper: EnsureUnitExistsHelper,
    private readonly writeHelper: UnitWriteHelper,
  ) {}

  async execute(data: IUpdateUnitDto): Promise<IUpdateUnitResponse> {
    const payload = this.validator.validateUpdate(data);
    const { id, ...update } = payload;

    await this.ensureExistsHelper.assertExists(id, { select: ['id'] });

    if (update.name != null) {
      await this.writeHelper.assertNameAvailable(update.name, id);
    }

    return this.repository.update(id, update);
  }
}
