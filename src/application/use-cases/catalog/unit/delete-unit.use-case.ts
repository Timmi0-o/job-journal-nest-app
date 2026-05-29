import type { IDeleteUnitDto, IDeleteUnitResponse } from '@application/dtos/catalog/unit';
import type { IUnitRepository } from '@domain/repositories/catalog/unit/i-unit.repository';
import type { IUnitValidator } from '@domain/validators/catalog/unit';
import { EnsureUnitExistsHelper } from './helpers';

export class DeleteUnitUseCase {
  constructor(
    private readonly validator: IUnitValidator,
    private readonly repository: IUnitRepository,
    private readonly ensureExistsHelper: EnsureUnitExistsHelper,
  ) {}

  async execute(data: IDeleteUnitDto): Promise<IDeleteUnitResponse> {
    const payload = this.validator.validateDelete(data);

    await this.ensureExistsHelper.assertExists(payload.id, { select: ['id'] });
    await this.repository.delete(payload.id);

    return true;
  }
}
