import {
  ICreateJournalInput,
  IJournalEntity,
  IUpdateJournalInput,
} from '@domain/entities/journal/journal/i-journal.entity';
import { IJournalRepository } from '@domain/repositories/journal/journal/i-journal.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaCrudRepository } from '../../prisma-crud.repository';

@Injectable()
export class JournalRepository
  extends PrismaCrudRepository<
    IJournalEntity,
    ICreateJournalInput,
    IUpdateJournalInput,
    undefined,
    PrismaService['journal'],
    PrismaService
  >
  implements IJournalRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  protected getDelegate(): PrismaService['journal'] {
    return this.getPrismaClient().journal;
  }

  protected toDomainEntity(row: unknown): IJournalEntity | null {
    if (row == null || typeof row !== 'object') {
      return null;
    }

    const record = row as Record<string, unknown>;
    const amount = record['amount'];

    return {
      ...(record as unknown as IJournalEntity),
      amount:
        amount != null &&
        typeof amount === 'object' &&
        'toString' in amount &&
        typeof (amount as { toString: unknown }).toString === 'function'
          ? (amount as { toString: () => string }).toString()
          : String(amount ?? ''),
    };
  }
}
