import type {
  ICreateUserDto,
  ICreateUserResponse,
} from '@application/dtos/identity/user';
import type { ICreateUserInput } from '@domain/entities/identity/user/i-user.entity';
import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import type { IPasswordService } from '@domain/services';
import type { IUserValidator } from '@domain/validators/identity/user';
import { UserWriteHelper } from './helpers';

export class CreateUserUseCase {
  constructor(
    private readonly validator: IUserValidator,
    private readonly repository: IUserRepository,
    private readonly writeHelper: UserWriteHelper,
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(data: ICreateUserDto): Promise<ICreateUserResponse> {
    const payload = this.validator.validateCreate(data);
    await this.writeHelper.assertEmailAvailable(payload.email);

    const { password, ...rest } = payload;
    const passwordHash = await this.passwordService.hash(password);
    const input: ICreateUserInput = { ...rest, passwordHash };

    return this.repository.create(input);
  }
}
