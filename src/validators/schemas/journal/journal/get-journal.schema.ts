import type { IGetJournalDto } from '@application/dtos/journal/journal';
import { idSchema, optionalPresetSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const getJournalSchema: JSONSchemaType<IGetJournalDto> = {
  type: 'object',
  properties: {
    id: idSchema,
    preset: optionalPresetSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
