import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import { Logger } from '@nestjs/common';
import { NotFoundError } from '@shared/errors/errors/business/not-found-error';

type IFindOneOptions = Parameters<IUserRepository['findOne']>[1];

export class EnsureUserExistsHelper {
  private readonly logger = new Logger(EnsureUserExistsHelper.name);

  constructor(private readonly repository: IUserRepository) {}

  async assertExists(
    id: string,
    options?: IFindOneOptions,
  ): Promise<NonNullable<Awaited<ReturnType<IUserRepository['findOne']>>>> {
    const entity = await this.repository.findOne(id, options);

    if (entity == null) {
      this.logger.warn(`User not found: id=${id}`);
      throw NotFoundError.withMessage('Пользователь не найден', { resourceId: id });
    }

    return entity;
  }
}
