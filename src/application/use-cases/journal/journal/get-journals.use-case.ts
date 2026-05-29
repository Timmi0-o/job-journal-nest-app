import type {
  IGetJournalsDto,
  IGetJournalsResponse,
} from '@application/dtos/journal/journal';
import { GetManyHelper } from '@application/use-cases/helpers';
import type { IJournalWithRelations } from '@domain/entities/journal/journal/i-journal.entity';
import type { IJournalRepository } from '@domain/repositories/journal/journal/i-journal.repository';
import type { IJournalValidator } from '@domain/validators/journal/journal';
import { getJournalPresetConfig } from '@shared/presets';
import { extractJournalDbWhere } from './helpers';

export class GetJournalsUseCase {
  constructor(
    private readonly validator: IJournalValidator,
    private readonly repository: IJournalRepository,
  ) {}

  async execute(data: IGetJournalsDto): Promise<IGetJournalsResponse> {
    const payload = this.validator.validateGetMany(data);
    const presetConfig = getJournalPresetConfig(payload.preset);
    const dbWhere = extractJournalDbWhere(payload.filter);

    const findParams = GetManyHelper.prepareFindManyParams({
      payload,
      presetSelect: presetConfig.select,
      where: dbWhere,
      requiredIds: payload.requiredIds,
      include: presetConfig.include,
    });

    const [journals, totalCount] =
      await GetManyHelper.findManyAndCount<IJournalWithRelations>(
        this.repository,
        findParams,
      );

    return GetManyHelper.buildResponse({
      data: journals,
      totalCount,
      limit: findParams.limit,
      offset: findParams.offset,
      page: payload.page,
      emptyLogMessage: 'Journals not found',
    });
  }
}
