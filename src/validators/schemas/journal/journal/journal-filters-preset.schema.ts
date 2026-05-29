import type { IJournalFiltersPreset } from '@shared/presets';
import {
  dateRangeFilterSchema,
  filterStringArraySchema,
  filterWithArrayValueSchema,
} from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const journalFiltersPresetSchema: JSONSchemaType<IJournalFiltersPreset> = {
  type: 'object',
  properties: {
    id: { ...filterStringArraySchema, nullable: true },
    jobVariantId: { ...filterStringArraySchema, nullable: true },
    unitId: { ...filterStringArraySchema, nullable: true },
    amount: { ...filterWithArrayValueSchema, nullable: true },
    endDate: { ...dateRangeFilterSchema, nullable: true },
    createdAt: { ...dateRangeFilterSchema, nullable: true },
    updatedAt: { ...dateRangeFilterSchema, nullable: true },
  },
  required: [],
  additionalProperties: false,
};
