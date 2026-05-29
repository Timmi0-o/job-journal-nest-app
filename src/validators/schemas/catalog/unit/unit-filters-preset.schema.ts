import type { IUnitFiltersPreset } from '@shared/presets';
import {
  dateRangeFilterSchema,
  filterStringArraySchema,
  searchFilterValueSchema,
} from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const unitFiltersPresetSchema: JSONSchemaType<IUnitFiltersPreset> = {
  type: 'object',
  properties: {
    search: { ...searchFilterValueSchema, nullable: true },
    id: { ...filterStringArraySchema, nullable: true },
    name: { ...filterStringArraySchema, nullable: true },
    createdAt: { ...dateRangeFilterSchema, nullable: true },
    updatedAt: { ...dateRangeFilterSchema, nullable: true },
  },
  required: [],
  additionalProperties: false,
};
