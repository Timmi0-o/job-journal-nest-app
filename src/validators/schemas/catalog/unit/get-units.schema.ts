import type { IGetUnitsDto } from '@application/dtos/catalog/unit';
import { presetSchema, querySchemaProperties } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';
import { unitFiltersPresetSchema } from './unit-filters-preset.schema';

export const getUnitsSchema: JSONSchemaType<IGetUnitsDto> = {
  type: 'object',
  properties: {
    preset: presetSchema,
    ...querySchemaProperties,
    filter: { ...unitFiltersPresetSchema, nullable: true },
  },
  required: ['preset'],
  additionalProperties: false,
};
