import type { IDeleteUnitDto } from '@application/dtos/catalog/unit';
import { idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const deleteUnitSchema: JSONSchemaType<IDeleteUnitDto> = {
  type: 'object',
  properties: {
    id: idSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
