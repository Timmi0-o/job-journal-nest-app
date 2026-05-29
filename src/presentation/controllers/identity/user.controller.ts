import type {
  ICreateUserDto,
  ICreateUserResponse,
  IDeleteUserResponse,
  IGetUserDto,
  IGetUserResponse,
  IGetUsersResponse,
  IUpdateUserDto,
  IUpdateUserResponse,
} from '@application/dtos/identity/user';
import { CreateUserUseCase } from '@application/use-cases/identity/user/create-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/identity/user/delete-user.use-case';
import { GetUserUseCase } from '@application/use-cases/identity/user/get-user.use-case';
import { GetUsersUseCase } from '@application/use-cases/identity/user/get-users.use-case';
import { splitArrayQueryParams } from '@application/use-cases/helpers';
import { UpdateUserUseCase } from '@application/use-cases/identity/user/update-user.use-case';
import type { IUserFiltersPreset } from '@shared/presets';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  async getUsers(
    @Query() query: Record<string, unknown>,
  ): Promise<IGetUsersResponse> {
    return this.getUsersUseCase.execute(
      splitArrayQueryParams<IUserFiltersPreset>(query),
    );
  }

  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @Query() query: Pick<IGetUserDto, 'preset'>,
  ): Promise<IGetUserResponse> {
    return this.getUserUseCase.execute({ id, preset: query.preset });
  }

  @Post()
  async createUser(@Body() data: ICreateUserDto): Promise<ICreateUserResponse> {
    return this.createUserUseCase.execute(data);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Omit<IUpdateUserDto, 'id'>,
  ): Promise<IUpdateUserResponse> {
    return this.updateUserUseCase.execute({ id, ...data });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<IDeleteUserResponse> {
    return this.deleteUserUseCase.execute({ id });
  }
}
