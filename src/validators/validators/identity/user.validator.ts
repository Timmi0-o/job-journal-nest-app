import type {
  ICreateUserDto,
  IDeleteUserDto,
  IGetUserDto,
  IGetUsersDto,
  IUpdateUserDto,
} from '@application/dtos/identity/user';
import type { IUserValidator } from '@domain/validators/identity/user';
import { Logger } from '@nestjs/common';
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  getUsersSchema,
  updateUserSchema,
} from '@validators/schemas/identity/user';
import { ajv, ajvStrict } from '../ajv-instance';
import { BaseValidator } from '../base.validator';

const validateGetOne = ajv.compile(getUserSchema);
const validateGetMany = ajv.compile(getUsersSchema);
const validateCreate = ajvStrict.compile(createUserSchema);
const validateUpdate = ajvStrict.compile(updateUserSchema);
const validateDelete = ajv.compile(deleteUserSchema);

export class UserValidator extends BaseValidator implements IUserValidator {
  constructor() {
    super(new Logger(UserValidator.name));
  }

  validateGetOne(data: IGetUserDto): IGetUserDto {
    return this.validateAndReturn({
      validate: validateGetOne,
      data,
      errorMessage: 'Произошла ошибка при валидации данных пользователя',
      logLabel: 'get user',
    });
  }

  validateGetMany(data: IGetUsersDto): IGetUsersDto {
    return this.validateAndReturn({
      validate: validateGetMany,
      data,
      errorMessage: 'Произошла ошибка при валидации списка пользователей',
      logLabel: 'get users',
    });
  }

  validateCreate(data: ICreateUserDto): ICreateUserDto {
    return this.validateAndReturn({
      validate: validateCreate,
      data,
      errorMessage: 'Произошла ошибка при валидации данных создания пользователя',
      logLabel: 'create user',
    });
  }

  validateUpdate(data: IUpdateUserDto): IUpdateUserDto {
    return this.validateAndReturn({
      validate: validateUpdate,
      data,
      errorMessage: 'Произошла ошибка при валидации данных обновления пользователя',
      logLabel: 'update user',
    });
  }

  validateDelete(data: IDeleteUserDto): IDeleteUserDto {
    return this.validateAndReturn({
      validate: validateDelete,
      data,
      errorMessage: 'Произошла ошибка при валидации данных удаления пользователя',
      logLabel: 'delete user',
    });
  }
}
