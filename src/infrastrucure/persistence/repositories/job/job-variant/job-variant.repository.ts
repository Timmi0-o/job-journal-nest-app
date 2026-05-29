import {
  ICreateJobVariantInput,
  IJobVariantEntity,
  IUpdateJobVariantInput,
} from '@domain/entities/job/job-variant/i-job-variant.entity';
import { IJobVariantRepository } from '@domain/repositories/job/job-variant/i-job-variant.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaCrudRepository } from '../../prisma-crud.repository';

@Injectable()
export class JobVariantRepository
  extends PrismaCrudRepository<
    IJobVariantEntity,
    ICreateJobVariantInput,
    IUpdateJobVariantInput,
    undefined,
    PrismaService['jobVariant'],
    PrismaService
  >
  implements IJobVariantRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  protected getDelegate(): PrismaService['jobVariant'] {
    return this.getPrismaClient().jobVariant;
  }

  async findOneByName(name: string): Promise<IJobVariantEntity | null> {
    const row = await this.getDelegate().findFirst({ where: { name } });
    return this.toDomainEntity(row);
  }
}
