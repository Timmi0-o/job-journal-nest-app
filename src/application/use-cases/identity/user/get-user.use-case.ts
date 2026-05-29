import type { IGetUserDto, IGetUserResponse } from '@application/dtos/identity/user';
import type { IUserValidator } from '@domain/validators/identity/user';
import { getUserPresetConfig } from '@shared/presets';
import { EnsureUserExistsHelper } from './helpers';

export class GetUserUseCase {
  constructor(
    private readonly validator: IUserValidator,
    private readonly ensureExistsHelper: EnsureUserExistsHelper,
  ) {}

  async execute(data: IGetUserDto): Promise<IGetUserResponse> {
    const payload = this.validator.validateGetOne(data);
    const presetConfig = getUserPresetConfig(payload.preset ?? 'BASE');

    return this.ensureExistsHelper.assertExists(payload.id, {
      ...(presetConfig.select?.length ? { select: presetConfig.select } : {}),
    });
  }
}
