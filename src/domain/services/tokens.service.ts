import { UserRole, UserStatus } from '@domain/entities/identity/user';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

type EntityId = string;
type Nullable<T> = T | null;

/****************************************
 *    Access token payload             *
 *****************************************/
export interface IAccessTokenPayload extends Record<string, unknown> {
  sub: EntityId;
  orgId: Nullable<EntityId>;
  roleId: Nullable<EntityId>;
  systemRole: UserRole;
  status: UserStatus;
}

/****************************************
 *    Refresh token payload             *
 *****************************************/
export interface IRefreshTokenPayload extends Record<string, unknown> {
  userId: string;
  ipAddress: string;
  userAgent: string;
  fingerprint: string;
}

/****************************************
 *    Reset password token payload      *
 *****************************************/
export interface IResetPasswordTokenPayload extends Record<string, unknown> {
  userId: string;
}

export interface IResetPasswordTokenPayloadWithExp extends IResetPasswordTokenPayload {
  exp: number;
}

/****************************************
 *    Set password token payload        *
 *****************************************/
export interface ISetPasswordTokenPayload extends Record<string, unknown> {
  userId: string;
}

export const TOKENS_SERVICE_TOKEN = Symbol('TOKENS_SERVICE');

export interface ITokensService {
  generateAccessToken(payload: IAccessTokenPayload, options?: JwtSignOptions): string;
  generateRefreshToken(payload: IRefreshTokenPayload, options?: JwtSignOptions): string;

  generateResetPasswordToken(payload: IResetPasswordTokenPayload, options?: JwtSignOptions): string;
  verifyResetPasswordToken(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<IResetPasswordTokenPayloadWithExp>;

  verifyAccessToken(token: string, options?: JwtVerifyOptions): Promise<IAccessTokenPayload>;
  verifyRefreshToken(token: string, options?: JwtVerifyOptions): Promise<IRefreshTokenPayload>;

  generateSetPasswordToken(payload: ISetPasswordTokenPayload, options?: JwtSignOptions): string;
  verifySetPasswordToken(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<ISetPasswordTokenPayload>;
}
