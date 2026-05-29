import type { IUserRepository } from '@domain/repositories/identity/user/i-user.repository';
import { Logger } from '@nestjs/common';
import { ConflictError } from '@shared/errors/errors/business/conflict-error';

export class UserWriteHelper {
  private readonly logger = new Logger(UserWriteHelper.name);

  constructor(private readonly repository: IUserRepository) {}

  async assertEmailAvailable(email: string, excludeId?: string): Promise<void> {
    const existing = await this.repository.findOneByEmail(email);

    if (existing != null && existing.id !== excludeId) {
      this.logger.warn(`User email already exists: email=${email}`);
      throw ConflictError.duplicate('User', 'email', email);
    }
  }
}
