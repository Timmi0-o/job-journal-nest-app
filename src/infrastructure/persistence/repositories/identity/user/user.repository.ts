import {
  ICreateUserInput,
  IUserEntity,
  IUpdateUserInput,
} from '@domain/entities/identity/user/i-user.entity';
import { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaCrudRepository } from '../../prisma-crud.repository';

@Injectable()
export class UserRepository
  extends PrismaCrudRepository<
    IUserEntity,
    ICreateUserInput,
    IUpdateUserInput,
    undefined,
    PrismaService['user'],
    PrismaService
  >
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  protected getDelegate(): PrismaService['user'] {
    return this.getPrismaClient().user;
  }

  async findOneByEmail(email: string): Promise<IUserEntity | null> {
    const row = await this.getDelegate().findFirst({ where: { email } });
    return this.toDomainEntity(row);
  }
}
