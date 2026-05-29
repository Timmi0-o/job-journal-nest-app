import type { IJobVariantRepository } from '@domain/repositories/job/job-variant/i-job-variant.repository';
import { Logger } from '@nestjs/common';
import { NotFoundError } from '@shared/errors/errors/business/not-found-error';

type IFindOneOptions = Parameters<IJobVariantRepository['findOne']>[1];

export class EnsureJobVariantExistsHelper {
  private readonly logger = new Logger(EnsureJobVariantExistsHelper.name);

  constructor(private readonly repository: IJobVariantRepository) {}

  async assertExists(
    id: string,
    options?: IFindOneOptions,
  ): Promise<NonNullable<Awaited<ReturnType<IJobVariantRepository['findOne']>>>> {
    const entity = await this.repository.findOne(id, options);

    if (entity == null) {
      this.logger.warn(`JobVariant not found: id=${id}`);
      throw NotFoundError.withMessage('Вариант работы не найден', { resourceId: id });
    }

    return entity;
  }
}
