import type {
  ILoginInput,
  ILoginResponse,
} from '@application/dtos/identity/auth';
import { UserStatus } from '@domain/entities/identity/user/user-status.enum';
import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import type { IPasswordService } from '@domain/services';
import type { IAuthValidator } from '@domain/validators/identity/auth';
import { ForbiddenError, UnauthorizedError } from '@shared/errors';
import { AuthTokenHelper } from './helpers';

export class LoginUseCase {
  constructor(
    private readonly validator: IAuthValidator,
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenHelper: AuthTokenHelper,
  ) {}

  async execute(data: ILoginInput): Promise<ILoginResponse> {
    const { email, password } = this.validator.validateLogin({
      email: data.email,
      password: data.password,
    });

    const user = await this.userRepository.findOneByEmail(email);

    if (user == null) {
      throw UnauthorizedError.invalidCredentials();
    }

    const isPasswordValid = await this.passwordService.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw UnauthorizedError.invalidCredentials();
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw ForbiddenError.operationNotAllowed('login', {
        metadata: { reason: 'USER_NOT_ACTIVE', status: user.status },
      });
    }

    return this.tokenHelper.issueTokens(user, {
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      fingerprint: data.fingerprint,
    });
  }
}
