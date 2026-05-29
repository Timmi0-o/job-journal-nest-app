import type {
  IRefreshInput,
  IRefreshResponse,
} from '@application/dtos/identity/auth';
import { UserStatus } from '@domain/entities/identity/user/user-status.enum';
import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import type { ITokensService } from '@domain/services';
import type { IAuthValidator } from '@domain/validators/identity/auth';
import { ForbiddenError, UnauthorizedError } from '@shared/errors';
import { AuthTokenHelper } from './helpers';

export class RefreshTokenUseCase {
  constructor(
    private readonly validator: IAuthValidator,
    private readonly userRepository: IUserRepository,
    private readonly tokensService: ITokensService,
    private readonly tokenHelper: AuthTokenHelper,
  ) {}

  async execute(data: IRefreshInput): Promise<IRefreshResponse> {
    const { refreshToken } = this.validator.validateRefresh({
      refreshToken: data.refreshToken,
    });

    const payload = await this.verifyRefreshToken(refreshToken);

    const user = await this.userRepository.findOne(payload.userId);

    if (user == null) {
      throw UnauthorizedError.tokenInvalid();
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw ForbiddenError.operationNotAllowed('refresh', {
        metadata: { reason: 'USER_NOT_ACTIVE', status: user.status },
      });
    }

    return this.tokenHelper.issueTokens(user, {
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      fingerprint: data.fingerprint,
    });
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.tokensService.verifyRefreshToken(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw UnauthorizedError.tokenInvalid();
    }
  }
}
