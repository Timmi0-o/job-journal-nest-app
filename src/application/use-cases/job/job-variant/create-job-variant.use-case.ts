import type {
  ICreateJobVariantDto,
  ICreateJobVariantResponse,
} from '@application/dtos/job/job-variant';
import type { IJobVariantRepository } from '@domain/repositories/job/job-variant/i-job-variant.repository';
import type { IJobVariantValidator } from '@domain/validators/job/job-variant';
import { JobVariantWriteHelper } from './helpers';

export class CreateJobVariantUseCase {
  constructor(
    private readonly validator: IJobVariantValidator,
    private readonly repository: IJobVariantRepository,
    private readonly writeHelper: JobVariantWriteHelper,
  ) {}

  async execute(data: ICreateJobVariantDto): Promise<ICreateJobVariantResponse> {
    const payload = this.validator.validateCreate(data);
    await this.writeHelper.assertNameAvailable(payload.name);
    return this.repository.create(payload);
  }
}
