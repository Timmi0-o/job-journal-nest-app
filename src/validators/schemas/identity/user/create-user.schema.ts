import type { ICreateUserDto } from '@application/dtos/identity/user';
import { UserRole } from '@domain/entities/identity/user/user-role.enum';
import { UserStatus } from '@domain/entities/identity/user/user-status.enum';
import { JSONSchemaType } from 'ajv';

export const createUserSchema = {
  type: 'object',
  properties: {
    surname: { type: 'string', minLength: 1, maxLength: 255 },
    name: { type: 'string', minLength: 1, maxLength: 255 },
    patronymic: {
      anyOf: [{ type: 'string', maxLength: 255 }, { type: 'null' }],
    },
    email: { type: 'string', format: 'email', maxLength: 255 },
    phone: {
      anyOf: [{ type: 'string', maxLength: 50 }, { type: 'null' }],
    },
    status: { type: 'string', enum: Object.values(UserStatus) },
    role: { type: 'string', enum: Object.values(UserRole) },
    passwordHash: { type: 'string', minLength: 8, maxLength: 255 },
  },
  required: ['surname', 'name', 'patronymic', 'email', 'phone', 'status', 'role', 'passwordHash'],
  additionalProperties: false,
} as JSONSchemaType<ICreateUserDto>;
