import { IGetByIdDto, IGetManyQueryDto, IGetManyResponse } from '@application/dtos/common';
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

export type IGetJournalResponse = IJournalEntity;

export type IGetJournalsResponse = IGetManyResponse<IJournalEntity>;

export type ICreateJournalResponse = IJournalEntity;

export type IUpdateJournalResponse = IJournalEntity;

export type IDeleteJournalResponse = boolean;
