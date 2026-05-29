import type { ILoginDto, IRefreshDto } from '@application/dtos/identity/auth';
import type { IAuthValidator } from '@domain/validators/identity/auth';
import { Logger } from '@nestjs/common';
import { loginSchema, refreshSchema } from '@validators/schemas/identity/auth';
import { ajvStrict } from '../ajv-instance';
import { BaseValidator } from '../base.validator';

const validateLoginFn = ajvStrict.compile(loginSchema);
const validateRefreshFn = ajvStrict.compile(refreshSchema);

export class AuthValidator extends BaseValidator implements IAuthValidator {
  constructor() {
    super(new Logger(AuthValidator.name));
  }

  validateLogin(data: ILoginDto): ILoginDto {
    return this.validateAndReturn({
      validate: validateLoginFn,
      data,
      errorMessage: 'Произошла ошибка при валидации данных входа',
      logLabel: 'login',
    });
  }

  validateRefresh(data: IRefreshDto): IRefreshDto {
    return this.validateAndReturn({
      validate: validateRefreshFn,
      data,
      errorMessage: 'Произошла ошибка при валидации токена обновления',
      logLabel: 'refresh',
    });
  }
}
