import { IJwtService } from '@domain/services';
import {
  JwtSignOptions,
  JwtVerifyOptions,
  JwtService as NestJwtService,
} from '@nestjs/jwt';
import { DecodeOptions } from 'jsonwebtoken';

export class JwtService implements IJwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  sign(payload: Record<string, unknown>, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  async verify(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<Record<string, unknown>> {
    return this.jwtService.verify(token, options);
  }

  decode(token: string, options?: DecodeOptions): Record<string, unknown> {
    return this.jwtService.decode(token, options);
  }
}
