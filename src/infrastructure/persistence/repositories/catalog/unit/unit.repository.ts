import {
  ICreateUnitInput,
  IUnitEntity,
  IUpdateUnitInput,
} from '@domain/entities/catalog/unit/i-unit.entity';
import { IUnitRepository } from '@domain/repositories/catalog/unit/i-unit.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaCrudRepository } from '../../prisma-crud.repository';

@Injectable()
export class UnitRepository
  extends PrismaCrudRepository<
    IUnitEntity,
    ICreateUnitInput,
    IUpdateUnitInput,
    undefined,
    PrismaService['unit'],
    PrismaService
  >
  implements IUnitRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  protected getDelegate(): PrismaService['unit'] {
    return this.getPrismaClient().unit;
  }

  async findOneByName(name: string): Promise<IUnitEntity | null> {
    const row = await this.getDelegate().findFirst({ where: { name } });
    return this.toDomainEntity(row);
  }
}
