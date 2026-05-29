import type {
  IDeleteJobVariantDto,
  IDeleteJobVariantResponse,
} from '@application/dtos/job/job-variant';
import type { IJobVariantRepository } from '@domain/repositories/job/job-variant/i-job-variant.repository';
import type { IJobVariantValidator } from '@domain/validators/job/job-variant';
import { EnsureJobVariantExistsHelper } from './helpers';

export class DeleteJobVariantUseCase {
  constructor(
    private readonly validator: IJobVariantValidator,
    private readonly repository: IJobVariantRepository,
    private readonly ensureExistsHelper: EnsureJobVariantExistsHelper,
  ) {}

  async execute(data: IDeleteJobVariantDto): Promise<IDeleteJobVariantResponse> {
    const payload = this.validator.validateDelete(data);

    await this.ensureExistsHelper.assertExists(payload.id, { select: ['id'] });
    await this.repository.delete(payload.id);

    return true;
  }
}
