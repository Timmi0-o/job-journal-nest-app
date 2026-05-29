import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
  IResetPasswordTokenPayload,
  IResetPasswordTokenPayloadWithExp,
  ISetPasswordTokenPayload,
  ITokensService,
} from '@domain/services';
import { Injectable } from '@nestjs/common';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Injectable()
export class TokensService implements ITokensService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(
    payload: IAccessTokenPayload,
    options?: JwtSignOptions,
  ): string {
    return this.jwtService.sign(payload, options);
  }

  generateRefreshToken(
    payload: IRefreshTokenPayload,
    options?: JwtSignOptions,
  ): string {
    return this.jwtService.sign(payload, options);
  }

  generateResetPasswordToken(
    payload: IResetPasswordTokenPayload,
    options?: JwtSignOptions,
  ): string {
    return this.jwtService.sign(payload, options);
  }

  generateSetPasswordToken(
    payload: ISetPasswordTokenPayload,
    options?: JwtSignOptions,
  ): string {
    return this.jwtService.sign(payload, options);
  }

  async verifyResetPasswordToken(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<IResetPasswordTokenPayloadWithExp> {
    return this.jwtService.verify(
      token,
      options,
    ) as Promise<IResetPasswordTokenPayloadWithExp>;
  }

  async verifyAccessToken(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<IAccessTokenPayload> {
    return this.jwtService.verify(
      token,
      options,
    ) as Promise<IAccessTokenPayload>;
  }

  async verifyRefreshToken(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<IRefreshTokenPayload> {
    return this.jwtService.verify(
      token,
      options,
    ) as Promise<IRefreshTokenPayload>;
  }

  async verifySetPasswordToken(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<ISetPasswordTokenPayload> {
    return this.jwtService.verify(
      token,
      options,
    ) as Promise<ISetPasswordTokenPayload>;
  }
}
