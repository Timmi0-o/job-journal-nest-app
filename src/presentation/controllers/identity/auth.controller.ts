import type {
  IAuthRequestContext,
  ILoginDto,
  ILoginResponse,
  IRefreshDto,
  IRefreshResponse,
} from '@application/dtos/identity/auth';
import {
  LoginUseCase,
  RefreshTokenUseCase,
} from '@application/use-cases/identity/auth';
import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

type ILoginBody = ILoginDto & { fingerprint?: string };
type IRefreshBody = IRefreshDto & { fingerprint?: string };

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('login')
  async login(
    @Body() body: ILoginBody,
    @Req() req: Request,
  ): Promise<ILoginResponse> {
    return this.loginUseCase.execute({
      email: body.email,
      password: body.password,
      ...this.buildContext(req, body.fingerprint),
    });
  }

  @Post('refresh')
  async refresh(
    @Body() body: IRefreshBody,
    @Req() req: Request,
  ): Promise<IRefreshResponse> {
    return this.refreshTokenUseCase.execute({
      refreshToken: body.refreshToken,
      ...this.buildContext(req, body.fingerprint),
    });
  }

  private buildContext(
    req: Request,
    fingerprint?: string,
  ): IAuthRequestContext {
    return {
      ipAddress: req.ip ?? '',
      userAgent: req.headers['user-agent'] ?? '',
      fingerprint: fingerprint ?? '',
    };
  }
}
