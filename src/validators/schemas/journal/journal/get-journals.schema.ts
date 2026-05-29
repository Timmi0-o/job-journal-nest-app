import type { IGetJournalsDto } from '@application/dtos/journal/journal';
import { presetSchema, querySchemaProperties } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';
import { journalFiltersPresetSchema } from './journal-filters-preset.schema';

export const getJournalsSchema: JSONSchemaType<IGetJournalsDto> = {
  type: 'object',
  properties: {
    preset: presetSchema,
    ...querySchemaProperties,
    filter: { ...journalFiltersPresetSchema, nullable: true },
  },
  required: ['preset'],
  additionalProperties: false,
};
