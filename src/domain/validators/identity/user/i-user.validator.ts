import {
  ICreateUserDto,
  IDeleteUserDto,
  IGetUserDto,
  IGetUsersDto,
  IUpdateUserDto,
} from '@application/dtos/identity/user';
import { IEntityValidator } from '@domain/validators/i-entity-validator.interface';

export type IUserValidator = IEntityValidator<
  IGetUserDto,
  IGetUsersDto,
  ICreateUserDto,
  IUpdateUserDto,
  IDeleteUserDto
>;

export const USER_VALIDATOR_TOKEN = Symbol('USER_VALIDATOR_TOKEN');
