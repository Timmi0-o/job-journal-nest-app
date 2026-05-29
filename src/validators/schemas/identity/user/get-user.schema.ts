import type { IGetUserDto } from '@application/dtos/identity/user';
import { idSchema, optionalPresetSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const getUserSchema: JSONSchemaType<IGetUserDto> = {
  type: 'object',
  properties: {
    id: idSchema,
    preset: optionalPresetSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
