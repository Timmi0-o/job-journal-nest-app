import { CreateUserUseCase } from '@application/use-cases/identity/user/create-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/identity/user/delete-user.use-case';
import { GetUserUseCase } from '@application/use-cases/identity/user/get-user.use-case';
import { GetUsersUseCase } from '@application/use-cases/identity/user/get-users.use-case';
import {
  EnsureUserExistsHelper,
  UserWriteHelper,
} from '@application/use-cases/identity/user/helpers';
import { UpdateUserUseCase } from '@application/use-cases/identity/user/update-user.use-case';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@domain/repositories/identity/user/i-user.repository';
import {
  IUserValidator,
  USER_VALIDATOR_TOKEN,
} from '@domain/validators/identity/user';
import { Module } from '@nestjs/common';
import { UserController } from '@presentation/controllers/identity/user.controller';
import { UserValidator } from '@validators/validators/identity/user.validator';
import { UserRepository } from 'src/infrastructure/persistence/repositories/identity/user/user.repository';

@Module({
  controllers: [UserController],
  exports: [USER_REPOSITORY_TOKEN],
  providers: [
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
    { provide: USER_VALIDATOR_TOKEN, useClass: UserValidator },
    {
      provide: EnsureUserExistsHelper,
      useFactory: (repo: IUserRepository) => new EnsureUserExistsHelper(repo),
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: UserWriteHelper,
      useFactory: (repo: IUserRepository) => new UserWriteHelper(repo),
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: GetUserUseCase,
      useFactory: (v: IUserValidator, h: EnsureUserExistsHelper) =>
        new GetUserUseCase(v, h),
      inject: [USER_VALIDATOR_TOKEN, EnsureUserExistsHelper],
    },
    {
      provide: GetUsersUseCase,
      useFactory: (v: IUserValidator, r: IUserRepository) =>
        new GetUsersUseCase(v, r),
      inject: [USER_VALIDATOR_TOKEN, USER_REPOSITORY_TOKEN],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (v: IUserValidator, r: IUserRepository, w: UserWriteHelper) =>
        new CreateUserUseCase(v, r, w),
      inject: [USER_VALIDATOR_TOKEN, USER_REPOSITORY_TOKEN, UserWriteHelper],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (
        v: IUserValidator,
        r: IUserRepository,
        e: EnsureUserExistsHelper,
        w: UserWriteHelper,
      ) => new UpdateUserUseCase(v, r, e, w),
      inject: [
        USER_VALIDATOR_TOKEN,
        USER_REPOSITORY_TOKEN,
        EnsureUserExistsHelper,
        UserWriteHelper,
      ],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (
        v: IUserValidator,
        r: IUserRepository,
        e: EnsureUserExistsHelper,
      ) => new DeleteUserUseCase(v, r, e),
      inject: [
        USER_VALIDATOR_TOKEN,
        USER_REPOSITORY_TOKEN,
        EnsureUserExistsHelper,
      ],
    },
  ],
})
export class UserModule {}
