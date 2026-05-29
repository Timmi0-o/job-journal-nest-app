import { IPasswordService } from '@domain/services';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly logger = new Logger(PasswordService.name);

  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      this.logger.error(`Error hashing password: ${error}`);
      throw new BadRequestException('Ошибка при хешировании пароля');
    }
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      this.logger.error(`Error comparing password: ${error}`);
      throw new BadRequestException('Ошибка при проверке пароля');
    }
  }
}
