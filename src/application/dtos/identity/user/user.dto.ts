import { IGetByIdDto, IGetManyQueryDto, IGetManyResponse } from '@application/dtos/common';
import {
  ICreateUserInput,
  IUpdateUserInput,
  IUserEntity,
} from '@domain/entities/identity/user/i-user.entity';
import { IUserFiltersPreset } from '@shared/presets';

export type IGetUserDto = IGetByIdDto;

export type IGetUsersDto = IGetManyQueryDto<IUserFiltersPreset>;

export type ICreateUserDto = ICreateUserInput;

export type IUpdateUserDto = { id: string } & IUpdateUserInput;

export type IDeleteUserDto = { id: string };

export type IGetUserResponse = IUserEntity;

export type IGetUsersResponse = IGetManyResponse<IUserEntity>;

export type ICreateUserResponse = IUserEntity;

export type IUpdateUserResponse = IUserEntity;

export type IDeleteUserResponse = boolean;
