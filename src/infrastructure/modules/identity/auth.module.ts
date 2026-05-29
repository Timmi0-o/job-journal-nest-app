import {
  LoginUseCase,
  RefreshTokenUseCase,
} from '@application/use-cases/identity/auth';
import { AuthTokenHelper } from '@application/use-cases/identity/auth/helpers';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@domain/repositories/identity/user/i-user.repository';
import {
  IPasswordService,
  ITokensService,
  PASSWORD_SERVICE_TOKEN,
  TOKENS_SERVICE_TOKEN,
} from '@domain/services';
import {
  AUTH_VALIDATOR_TOKEN,
  IAuthValidator,
} from '@domain/validators/identity/auth';
import { Module } from '@nestjs/common';
import {
  JwtModule,
  JwtService as NestJwtService,
  type JwtSignOptions,
} from '@nestjs/jwt';
import { AuthController } from '@presentation/controllers/identity/auth.controller';
import { AuthValidator } from '@validators/validators/identity/auth.validator';
import { UserModule } from './user.module';
import { PasswordService } from 'src/infrastructure/services/bcrypt-password.service';
import { JwtService } from 'src/infrastructure/services/jwt.service';
import { TokensService } from 'src/infrastructure/services/tokens.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn:
          (process.env.JWT_ACCESS_EXPIRES_IN as JwtSignOptions['expiresIn']) ??
          '15m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: PASSWORD_SERVICE_TOKEN, useClass: PasswordService },
    { provide: AUTH_VALIDATOR_TOKEN, useClass: AuthValidator },
    {
      provide: JwtService,
      useFactory: (nestJwtService: NestJwtService) =>
        new JwtService(nestJwtService),
      inject: [NestJwtService],
    },
    {
      provide: TOKENS_SERVICE_TOKEN,
      useFactory: (jwtService: JwtService) => new TokensService(jwtService),
      inject: [JwtService],
    },
    {
      provide: AuthTokenHelper,
      useFactory: (tokensService: ITokensService) =>
        new AuthTokenHelper(tokensService),
      inject: [TOKENS_SERVICE_TOKEN],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        validator: IAuthValidator,
        userRepository: IUserRepository,
        passwordService: IPasswordService,
        tokenHelper: AuthTokenHelper,
      ) =>
        new LoginUseCase(
          validator,
          userRepository,
          passwordService,
          tokenHelper,
        ),
      inject: [
        AUTH_VALIDATOR_TOKEN,
        USER_REPOSITORY_TOKEN,
        PASSWORD_SERVICE_TOKEN,
        AuthTokenHelper,
      ],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        validator: IAuthValidator,
        userRepository: IUserRepository,
        tokensService: ITokensService,
        tokenHelper: AuthTokenHelper,
      ) =>
        new RefreshTokenUseCase(
          validator,
          userRepository,
          tokensService,
          tokenHelper,
        ),
      inject: [
        AUTH_VALIDATOR_TOKEN,
        USER_REPOSITORY_TOKEN,
        TOKENS_SERVICE_TOKEN,
        AuthTokenHelper,
      ],
    },
  ],
})
export class AuthModule {}
