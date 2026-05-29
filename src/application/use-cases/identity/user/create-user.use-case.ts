import type {
  ICreateUserDto,
  ICreateUserResponse,
} from '@application/dtos/identity/user';
import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import type { IUserValidator } from '@domain/validators/identity/user';
import { UserWriteHelper } from './helpers';

export class CreateUserUseCase {
  constructor(
    private readonly validator: IUserValidator,
    private readonly repository: IUserRepository,
    private readonly writeHelper: UserWriteHelper,
  ) {}

  async execute(data: ICreateUserDto): Promise<ICreateUserResponse> {
    const payload = this.validator.validateCreate(data);
    await this.writeHelper.assertEmailAvailable(payload.email);
    return this.repository.create(payload);
  }
}
