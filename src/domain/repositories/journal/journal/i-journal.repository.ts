import {
  ICreateJournalInput,
  IJournalEntity,
  IJournalRelations,
  IUpdateJournalInput,
} from '@domain/entities/journal/journal/i-journal.entity';
import { ICommonRepository } from '@domain/repositories/i-common.repository';

export const JOURNAL_REPOSITORY_TOKEN = Symbol('JOURNAL_REPOSITORY_TOKEN');

export interface IJournalRepository extends ICommonRepository<
  IJournalEntity,
  ICreateJournalInput,
  IUpdateJournalInput,
  IJournalRelations
> {}
