import type {
  ICreateUnitDto,
  ICreateUnitResponse,
} from '@application/dtos/catalog/unit';
import type { IUnitRepository } from '@domain/repositories/catalog/unit/i-unit.repository';
import type { IUnitValidator } from '@domain/validators/catalog/unit';
import { UnitWriteHelper } from './helpers';

export class CreateUnitUseCase {
  constructor(
    private readonly validator: IUnitValidator,
    private readonly repository: IUnitRepository,
    private readonly writeHelper: UnitWriteHelper,
  ) {}

  async execute(data: ICreateUnitDto): Promise<ICreateUnitResponse> {
    const payload = this.validator.validateCreate(data);
    await this.writeHelper.assertNameAvailable(payload.name);
    return this.repository.create(payload);
  }
}
