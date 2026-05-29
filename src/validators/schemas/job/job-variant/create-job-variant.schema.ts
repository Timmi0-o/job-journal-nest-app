import type { ICreateJobVariantDto } from '@application/dtos/job/job-variant';
import { JSONSchemaType } from 'ajv';

export const createJobVariantSchema: JSONSchemaType<ICreateJobVariantDto> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 255 },
  },
  required: ['name'],
  additionalProperties: false,
};
