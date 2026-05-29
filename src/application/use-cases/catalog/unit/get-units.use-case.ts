import type { IGetUnitsDto, IGetUnitsResponse } from '@application/dtos/catalog/unit';
import { GetManyHelper } from '@application/use-cases/helpers';
import type { IUnitEntity } from '@domain/entities/catalog/unit/i-unit.entity';
import type { IUnitRepository } from '@domain/repositories/catalog/unit/i-unit.repository';
import type { IUnitValidator } from '@domain/validators/catalog/unit';
import { getUnitPresetConfig } from '@shared/presets';
import { extractUnitDbWhere } from './helpers';

export class GetUnitsUseCase {
  constructor(
    private readonly validator: IUnitValidator,
    private readonly repository: IUnitRepository,
  ) {}

  async execute(data: IGetUnitsDto): Promise<IGetUnitsResponse> {
    const payload = this.validator.validateGetMany(data);
    const presetConfig = getUnitPresetConfig(payload.preset);
    const dbWhere = extractUnitDbWhere(payload.filter);

    const findParams = GetManyHelper.prepareFindManyParams({
      payload,
      presetSelect: presetConfig.select as string[],
      where: dbWhere,
      requiredIds: payload.requiredIds,
    });

    const [units, totalCount] = await GetManyHelper.findManyAndCount<IUnitEntity>(
      this.repository,
      findParams,
    );

    return GetManyHelper.buildResponse({
      data: units,
      totalCount,
      limit: findParams.limit,
      offset: findParams.offset,
      page: payload.page,
      emptyLogMessage: 'Units not found',
    });
  }
}
