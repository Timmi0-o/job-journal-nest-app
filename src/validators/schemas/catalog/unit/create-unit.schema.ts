import type { ICreateUnitDto } from '@application/dtos/catalog/unit';
import { JSONSchemaType } from 'ajv';

export const createUnitSchema: JSONSchemaType<ICreateUnitDto> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 255 },
  },
  required: ['name'],
  additionalProperties: false,
};
