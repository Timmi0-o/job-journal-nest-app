import type { IUnitRepository } from '@domain/repositories/catalog/unit/i-unit.repository';
import { Logger } from '@nestjs/common';
import { NotFoundError } from '@shared/errors/errors/business/not-found-error';

type IFindOneOptions = Parameters<IUnitRepository['findOne']>[1];

export class EnsureUnitExistsHelper {
  private readonly logger = new Logger(EnsureUnitExistsHelper.name);

  constructor(private readonly repository: IUnitRepository) {}

  async assertExists(
    id: string,
    options?: IFindOneOptions,
  ): Promise<NonNullable<Awaited<ReturnType<IUnitRepository['findOne']>>>> {
    const entity = await this.repository.findOne(id, options);

    if (entity == null) {
      this.logger.warn(`Unit not found: id=${id}`);
      throw NotFoundError.withMessage('Единица измерения не найдена', {
        resourceId: id,
      });
    }

    return entity;
  }
}
