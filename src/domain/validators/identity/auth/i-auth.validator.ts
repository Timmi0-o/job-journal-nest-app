import { ILoginDto, IRefreshDto } from '@application/dtos/identity/auth';

export interface IAuthValidator {
  validateLogin(data: ILoginDto): ILoginDto;
  validateRefresh(data: IRefreshDto): IRefreshDto;
}

export const AUTH_VALIDATOR_TOKEN = Symbol('AUTH_VALIDATOR_TOKEN');
