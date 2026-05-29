import type {
  IUpdateJobVariantDto,
  IUpdateJobVariantResponse,
} from '@application/dtos/job/job-variant';
import type { IJobVariantRepository } from '@domain/repositories/job/job-variant/i-job-variant.repository';
import type { IJobVariantValidator } from '@domain/validators/job/job-variant';
import { EnsureJobVariantExistsHelper, JobVariantWriteHelper } from './helpers';

export class UpdateJobVariantUseCase {
  constructor(
    private readonly validator: IJobVariantValidator,
    private readonly repository: IJobVariantRepository,
    private readonly ensureExistsHelper: EnsureJobVariantExistsHelper,
    private readonly writeHelper: JobVariantWriteHelper,
  ) {}

  async execute(data: IUpdateJobVariantDto): Promise<IUpdateJobVariantResponse> {
    const payload = this.validator.validateUpdate(data);
    const { id, ...update } = payload;

    await this.ensureExistsHelper.assertExists(id, { select: ['id'] });

    if (update.name != null) {
      await this.writeHelper.assertNameAvailable(update.name, id);
    }

    return this.repository.update(id, update);
  }
}
