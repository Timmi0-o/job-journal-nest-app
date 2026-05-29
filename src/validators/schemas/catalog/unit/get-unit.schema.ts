import type { IGetUnitDto } from '@application/dtos/catalog/unit';
import { idSchema, optionalPresetSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const getUnitSchema: JSONSchemaType<IGetUnitDto> = {
  type: 'object',
  properties: {
    id: idSchema,
    preset: optionalPresetSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
