import type { IDeleteUserDto } from '@application/dtos/identity/user';
import { idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const deleteUserSchema: JSONSchemaType<IDeleteUserDto> = {
  type: 'object',
  properties: {
    id: idSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
