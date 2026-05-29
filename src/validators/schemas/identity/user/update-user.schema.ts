import type { IUpdateUserDto } from '@application/dtos/identity/user';
import { UserRole } from '@domain/entities/identity/user/user-role.enum';
import { UserStatus } from '@domain/entities/identity/user/user-status.enum';
import { idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const updateUserSchema: JSONSchemaType<IUpdateUserDto> = {
  type: 'object',
  properties: {
    id: idSchema,
    surname: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
    name: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
    patronymic: { type: 'string', maxLength: 255, nullable: true },
    email: { type: 'string', format: 'email', maxLength: 255, nullable: true },
    phone: { type: 'string', maxLength: 50, nullable: true },
    status: { type: 'string', enum: Object.values(UserStatus), nullable: true },
    role: { type: 'string', enum: Object.values(UserRole), nullable: true },
    passwordHash: { type: 'string', minLength: 8, maxLength: 255, nullable: true },
  },
  required: ['id'],
  additionalProperties: false,
};
