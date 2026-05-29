import type {
  IGetJobVariantsDto,
  IGetJobVariantsResponse,
} from '@application/dtos/job/job-variant';
import { GetManyHelper } from '@application/use-cases/helpers';
import type { IJobVariantEntity } from '@domain/entities/job/job-variant/i-job-variant.entity';
import type { IJobVariantRepository } from '@domain/repositories/job/job-variant/i-job-variant.repository';
import type { IJobVariantValidator } from '@domain/validators/job/job-variant';
import { getJobVariantPresetConfig } from '@shared/presets';
import { extractJobVariantDbWhere } from './helpers';

export class GetJobVariantsUseCase {
  constructor(
    private readonly validator: IJobVariantValidator,
    private readonly repository: IJobVariantRepository,
  ) {}

  async execute(data: IGetJobVariantsDto): Promise<IGetJobVariantsResponse> {
    const payload = this.validator.validateGetMany(data);
    const presetConfig = getJobVariantPresetConfig(payload.preset);
    const dbWhere = extractJobVariantDbWhere(payload.filter);

    const findParams = GetManyHelper.prepareFindManyParams({
      payload,
      presetSelect: presetConfig.select as string[],
      where: dbWhere,
      requiredIds: payload.requiredIds,
    });

    const [jobVariants, totalCount] = await GetManyHelper.findManyAndCount<IJobVariantEntity>(
      this.repository,
      findParams,
    );

    return GetManyHelper.buildResponse({
      data: jobVariants,
      totalCount,
      limit: findParams.limit,
      offset: findParams.offset,
      page: payload.page,
      emptyLogMessage: 'Job variants not found',
    });
  }
}
