import {
  ICreateUserInput,
  IUserEntity,
  IUpdateUserInput,
} from '@domain/entities/identity/user/i-user.entity';
import { ICommonRepository } from '@domain/repositories/i-common.repository';

export const USER_REPOSITORY_TOKEN = Symbol('USER_REPOSITORY_TOKEN');

export interface IUserRepository extends ICommonRepository<
  IUserEntity,
  ICreateUserInput,
  IUpdateUserInput,
  undefined
> {
  findOneByEmail(email: string): Promise<IUserEntity | null>;
}
