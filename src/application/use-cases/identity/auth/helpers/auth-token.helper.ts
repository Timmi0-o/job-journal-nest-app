import type {
  IAuthRequestContext,
  IAuthTokens,
} from '@application/dtos/identity/auth';
import type { IUserEntity } from '@domain/entities/identity/user/i-user.entity';
import type { ITokensService } from '@domain/services';
import type { JwtSignOptions } from '@nestjs/jwt';

type ExpiresIn = JwtSignOptions['expiresIn'];

const DEFAULT_ACCESS_EXPIRES_IN: ExpiresIn = '15m';
const DEFAULT_REFRESH_EXPIRES_IN: ExpiresIn = '7d';

export class AuthTokenHelper {
  constructor(private readonly tokensService: ITokensService) {}

  issueTokens(user: IUserEntity, context: IAuthRequestContext): IAuthTokens {
    const accessToken = this.tokensService.generateAccessToken(
      {
        sub: user.id,
        orgId: null,
        roleId: null,
        systemRole: user.role,
        status: user.status,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn:
          (process.env.JWT_ACCESS_EXPIRES_IN as ExpiresIn) ??
          DEFAULT_ACCESS_EXPIRES_IN,
      },
    );

    const refreshToken = this.tokensService.generateRefreshToken(
      {
        userId: user.id,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        fingerprint: context.fingerprint,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn:
          (process.env.JWT_REFRESH_EXPIRES_IN as ExpiresIn) ??
          DEFAULT_REFRESH_EXPIRES_IN,
      },
    );

    return { accessToken, refreshToken };
  }
}
