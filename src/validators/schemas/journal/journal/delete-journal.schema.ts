import type { IDeleteJournalDto } from '@application/dtos/journal/journal';
import { idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const deleteJournalSchema: JSONSchemaType<IDeleteJournalDto> = {
  type: 'object',
  properties: {
    id: idSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
