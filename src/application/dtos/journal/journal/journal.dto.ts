import { IGetByIdDto, IGetManyQueryDto } from '@application/dtos/common';
import {
  ICreateJournalInput,
  IJournalEntity,
  IUpdateJournalInput,
} from '@domain/entities/journal/journal/i-journal.entity';
import { IJournalFiltersPreset } from '@shared/presets';

export type IGetJournalDto = IGetByIdDto;

export type IGetJournalsDto = IGetManyQueryDto<IJournalFiltersPreset>;

type IJournalDateInput = Omit<ICreateJournalInput, 'endDate'> & { endDate: string };

export type ICreateJournalDto = IJournalDateInput;

export type IUpdateJournalDto = { id: string } & Partial<IJournalDateInput>;

export type IDeleteJournalDto = { id: string };

export type IJournalResponse = IJournalEntity;
