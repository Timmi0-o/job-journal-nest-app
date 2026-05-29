import type {
  ICreateJournalDto,
  ICreateJournalResponse,
} from '@application/dtos/journal/journal';
import type { IJournalRepository } from '@domain/repositories/journal/journal/i-journal.repository';
import type { IJournalValidator } from '@domain/validators/journal/journal';
import { JournalWriteHelper, mapCreateJournalDtoToInput } from './helpers';

export class CreateJournalUseCase {
  constructor(
    private readonly validator: IJournalValidator,
    private readonly repository: IJournalRepository,
    private readonly writeHelper: JournalWriteHelper,
  ) {}

  async execute(data: ICreateJournalDto): Promise<ICreateJournalResponse> {
    const payload = this.validator.validateCreate(data);
    const input = mapCreateJournalDtoToInput(payload);
    await this.writeHelper.assertRelationsExist(input);
    return this.repository.create(input);
  }
}
