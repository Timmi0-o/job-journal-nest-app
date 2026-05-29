import type { IUpdateUnitDto } from '@application/dtos/catalog/unit';
import { idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const updateUnitSchema: JSONSchemaType<IUpdateUnitDto> = {
  type: 'object',
  properties: {
    id: idSchema,
    name: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
  },
  required: ['id'],
  additionalProperties: false,
};
