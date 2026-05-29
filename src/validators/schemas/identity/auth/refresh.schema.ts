import type { IRefreshDto } from '@application/dtos/identity/auth';
import { JSONSchemaType } from 'ajv';

export const refreshSchema: JSONSchemaType<IRefreshDto> = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string', minLength: 1 },
  },
  required: ['refreshToken'],
  additionalProperties: false,
};
