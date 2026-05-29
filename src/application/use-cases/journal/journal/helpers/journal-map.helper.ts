import type { ICreateJournalDto, IUpdateJournalDto } from '@application/dtos/journal/journal';
import type {
  ICreateJournalInput,
  IUpdateJournalInput,
} from '@domain/entities/journal/journal/i-journal.entity';

export function mapCreateJournalDtoToInput(dto: ICreateJournalDto): ICreateJournalInput {
  return {
    jobVariantId: dto.jobVariantId,
    amount: dto.amount,
    unitId: dto.unitId,
    endDate: new Date(dto.endDate),
  };
}

export function mapUpdateJournalDtoToInput(dto: IUpdateJournalDto): IUpdateJournalInput {
  const { id: _id, endDate, ...rest } = dto;
  const input: IUpdateJournalInput = { ...rest };

  if (endDate != null) {
    input.endDate = new Date(endDate);
  }

  return input;
}
