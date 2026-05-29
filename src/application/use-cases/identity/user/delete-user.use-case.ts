import type { IDeleteUserDto, IDeleteUserResponse } from '@application/dtos/identity/user';
import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import type { IUserValidator } from '@domain/validators/identity/user';
import { EnsureUserExistsHelper } from './helpers';

export class DeleteUserUseCase {
  constructor(
    private readonly validator: IUserValidator,
    private readonly repository: IUserRepository,
    private readonly ensureExistsHelper: EnsureUserExistsHelper,
  ) {}

  async execute(data: IDeleteUserDto): Promise<IDeleteUserResponse> {
    const payload = this.validator.validateDelete(data);

    await this.ensureExistsHelper.assertExists(payload.id, { select: ['id'] });
    await this.repository.delete(payload.id);

    return true;
  }
}
