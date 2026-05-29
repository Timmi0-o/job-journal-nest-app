import {
  ICreateJournalDto,
  IDeleteJournalDto,
  IGetJournalDto,
  IGetJournalsDto,
  IUpdateJournalDto,
} from '@application/dtos/journal/journal';
import { IEntityValidator } from '@domain/validators/i-entity-validator.interface';

export type IJournalValidator = IEntityValidator<
  IGetJournalDto,
  IGetJournalsDto,
  ICreateJournalDto,
  IUpdateJournalDto,
  IDeleteJournalDto
>;

export const JOURNAL_VALIDATOR_TOKEN = Symbol('JOURNAL_VALIDATOR_TOKEN');
