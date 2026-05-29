import { ITransactionParticipant, ITransactionService } from '@domain/services';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaTransactionService implements ITransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async execute<
    T,
    const R extends readonly ITransactionParticipant[] =
      ITransactionParticipant[],
  >(callback: () => Promise<T>, repositories: R): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      try {
        repositories.forEach((repo) => repo.setTransactionClient(tx));

        const result = await callback();

        return result;
      } finally {
        repositories.forEach((repo) => repo.setTransactionClient(null));
      }
    });
  }
}
