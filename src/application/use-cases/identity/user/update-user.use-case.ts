import type { IUpdateUserDto, IUpdateUserResponse } from '@application/dtos/identity/user';
import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import type { IUserValidator } from '@domain/validators/identity/user';
import { EnsureUserExistsHelper, UserWriteHelper } from './helpers';

export class UpdateUserUseCase {
  constructor(
    private readonly validator: IUserValidator,
    private readonly repository: IUserRepository,
    private readonly ensureExistsHelper: EnsureUserExistsHelper,
    private readonly writeHelper: UserWriteHelper,
  ) {}

  async execute(data: IUpdateUserDto): Promise<IUpdateUserResponse> {
    const payload = this.validator.validateUpdate(data);
    const { id, ...update } = payload;

    await this.ensureExistsHelper.assertExists(id, { select: ['id'] });

    if (update.email != null) {
      await this.writeHelper.assertEmailAvailable(update.email, id);
    }

    return this.repository.update(id, update);
  }
}
