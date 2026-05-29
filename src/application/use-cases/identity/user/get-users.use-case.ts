import type { IGetUsersDto, IGetUsersResponse } from '@application/dtos/identity/user';
import { GetManyHelper } from '@application/use-cases/helpers';
import type { IUserEntity } from '@domain/entities/identity/user/i-user.entity';
import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import type { IUserValidator } from '@domain/validators/identity/user';
import { getUserPresetConfig } from '@shared/presets';
import { extractUserDbWhere } from './helpers';

export class GetUsersUseCase {
  constructor(
    private readonly validator: IUserValidator,
    private readonly repository: IUserRepository,
  ) {}

  async execute(data: IGetUsersDto): Promise<IGetUsersResponse> {
    const payload = this.validator.validateGetMany(data);
    const presetConfig = getUserPresetConfig(payload.preset);
    const dbWhere = extractUserDbWhere(payload.filter);

    const findParams = GetManyHelper.prepareFindManyParams({
      payload,
      presetSelect: presetConfig.select as string[],
      where: dbWhere,
      requiredIds: payload.requiredIds,
    });

    const [users, totalCount] = await GetManyHelper.findManyAndCount<IUserEntity>(
      this.repository,
      findParams,
    );

    return GetManyHelper.buildResponse({
      data: users,
      totalCount,
      limit: findParams.limit,
      offset: findParams.offset,
      page: payload.page,
      emptyLogMessage: 'Users not found',
    });
  }
}
