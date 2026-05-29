import type {
  IUpdateUserDto,
  IUpdateUserResponse,
} from '@application/dtos/identity/user';
import type { IUpdateUserInput } from '@domain/entities/identity/user/i-user.entity';
import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import type { IPasswordService } from '@domain/services';
import type { IUserValidator } from '@domain/validators/identity/user';
import { EnsureUserExistsHelper, UserWriteHelper } from './helpers';

export class UpdateUserUseCase {
  constructor(
    private readonly validator: IUserValidator,
    private readonly repository: IUserRepository,
    private readonly ensureExistsHelper: EnsureUserExistsHelper,
    private readonly writeHelper: UserWriteHelper,
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(data: IUpdateUserDto): Promise<IUpdateUserResponse> {
    const payload = this.validator.validateUpdate(data);
    const { id, password, ...update } = payload;

    await this.ensureExistsHelper.assertExists(id, { select: ['id'] });

    if (update.email != null) {
      await this.writeHelper.assertEmailAvailable(update.email, id);
    }

    const dbUpdate: IUpdateUserInput = { ...update };

    if (password != null) {
      dbUpdate.passwordHash = await this.passwordService.hash(password);
    }

    return this.repository.update(id, dbUpdate);
  }
}
