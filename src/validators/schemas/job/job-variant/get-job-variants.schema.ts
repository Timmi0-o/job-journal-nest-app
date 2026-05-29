import type { IGetJobVariantsDto } from '@application/dtos/job/job-variant';
import { presetSchema, querySchemaProperties } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';
import { jobVariantFiltersPresetSchema } from './job-variant-filters-preset.schema';

export const getJobVariantsSchema: JSONSchemaType<IGetJobVariantsDto> = {
  type: 'object',
  properties: {
    preset: presetSchema,
    ...querySchemaProperties,
    filter: { ...jobVariantFiltersPresetSchema, nullable: true },
  },
  required: ['preset'],
  additionalProperties: false,
};
