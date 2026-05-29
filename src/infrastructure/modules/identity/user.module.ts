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
  IPasswordService,
  PASSWORD_SERVICE_TOKEN,
} from '@domain/services';
import {
  IUserValidator,
  USER_VALIDATOR_TOKEN,
} from '@domain/validators/identity/user';
import { Module } from '@nestjs/common';
import { UserController } from '@presentation/controllers/identity/user.controller';
import { UserValidator } from '@validators/validators/identity/user.validator';
import { PasswordService } from 'src/infrastructure/services/bcrypt-password.service';
import { UserRepository } from 'src/infrastructure/persistence/repositories/identity/user/user.repository';

@Module({
  controllers: [UserController],
  exports: [USER_REPOSITORY_TOKEN],
  providers: [
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
    { provide: USER_VALIDATOR_TOKEN, useClass: UserValidator },
    { provide: PASSWORD_SERVICE_TOKEN, useClass: PasswordService },
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
      useFactory: (
        v: IUserValidator,
        r: IUserRepository,
        w: UserWriteHelper,
        passwordService: IPasswordService,
      ) => new CreateUserUseCase(v, r, w, passwordService),
      inject: [
        USER_VALIDATOR_TOKEN,
        USER_REPOSITORY_TOKEN,
        UserWriteHelper,
        PASSWORD_SERVICE_TOKEN,
      ],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (
        v: IUserValidator,
        r: IUserRepository,
        e: EnsureUserExistsHelper,
        w: UserWriteHelper,
        passwordService: IPasswordService,
      ) => new UpdateUserUseCase(v, r, e, w, passwordService),
      inject: [
        USER_VALIDATOR_TOKEN,
        USER_REPOSITORY_TOKEN,
        EnsureUserExistsHelper,
        UserWriteHelper,
        PASSWORD_SERVICE_TOKEN,
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
