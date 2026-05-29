import type { IUnitRepository } from '@domain/repositories/catalog/unit/i-unit.repository';
import { Logger } from '@nestjs/common';
import { ConflictError } from '@shared/errors/errors/business/conflict-error';

export class UnitWriteHelper {
  private readonly logger = new Logger(UnitWriteHelper.name);

  constructor(private readonly repository: IUnitRepository) {}

  async assertNameAvailable(name: string, excludeId?: string): Promise<void> {
    const existing = await this.repository.findOneByName(name);

    if (existing != null && existing.id !== excludeId) {
      this.logger.warn(`Unit name already exists: name=${name}`);
      throw ConflictError.duplicate('Unit', 'name', name);
    }
  }
}
