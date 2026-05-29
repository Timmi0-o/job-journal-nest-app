import type { IUpdateJournalDto } from '@application/dtos/journal/journal';
import { decimalStringPattern, idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const updateJournalSchema: JSONSchemaType<IUpdateJournalDto> = {
  type: 'object',
  properties: {
    id: idSchema,
    jobVariantId: { ...idSchema, nullable: true },
    amount: { type: 'string', pattern: decimalStringPattern, minLength: 1, nullable: true },
    unitId: { ...idSchema, nullable: true },
    endDate: { type: 'string', format: 'date-time', nullable: true },
  },
  required: ['id'],
  additionalProperties: false,
};
