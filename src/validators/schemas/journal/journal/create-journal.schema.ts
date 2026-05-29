import type { ICreateJournalDto } from '@application/dtos/journal/journal';
import { decimalStringPattern, idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const createJournalSchema: JSONSchemaType<ICreateJournalDto> = {
  type: 'object',
  properties: {
    jobVariantId: idSchema,
    amount: { type: 'string', pattern: decimalStringPattern, minLength: 1 },
    unitId: idSchema,
    endDate: { type: 'string', format: 'date-time' },
  },
  required: ['jobVariantId', 'amount', 'unitId', 'endDate'],
  additionalProperties: false,
};
