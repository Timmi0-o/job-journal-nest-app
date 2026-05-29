export interface ILoginDto {
  email: string;
  password: string;
}

export interface IRefreshDto {
  refreshToken: string;
}

export interface IAuthRequestContext {
  ipAddress: string;
  userAgent: string;
  fingerprint: string;
}

export type ILoginInput = ILoginDto & IAuthRequestContext;

export type IRefreshInput = IRefreshDto & IAuthRequestContext;

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type ILoginResponse = IAuthTokens;

export type IRefreshResponse = IAuthTokens;
