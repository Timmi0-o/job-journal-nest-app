import type { ILoginDto } from '@application/dtos/identity/auth';
import { JSONSchemaType } from 'ajv';

export const loginSchema: JSONSchemaType<ILoginDto> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string', minLength: 8, maxLength: 255 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
