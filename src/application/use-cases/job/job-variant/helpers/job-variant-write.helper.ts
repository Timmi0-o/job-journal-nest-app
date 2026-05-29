import type { IJobVariantRepository } from '@domain/repositories/job/job-variant/i-job-variant.repository';
import { Logger } from '@nestjs/common';
import { ConflictError } from '@shared/errors/errors/business/conflict-error';

export class JobVariantWriteHelper {
  private readonly logger = new Logger(JobVariantWriteHelper.name);

  constructor(private readonly repository: IJobVariantRepository) {}

  async assertNameAvailable(name: string, excludeId?: string): Promise<void> {
    const existing = await this.repository.findOneByName(name);

    if (existing != null && existing.id !== excludeId) {
      this.logger.warn(`JobVariant name already exists: name=${name}`);
      throw ConflictError.duplicate('JobVariant', 'name', name);
    }
  }
}
