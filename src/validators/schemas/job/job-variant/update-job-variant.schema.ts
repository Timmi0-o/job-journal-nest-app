import type { IUpdateJobVariantDto } from '@application/dtos/job/job-variant';
import { idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const updateJobVariantSchema: JSONSchemaType<IUpdateJobVariantDto> = {
  type: 'object',
  properties: {
    id: idSchema,
    name: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
  },
  required: ['id'],
  additionalProperties: false,
};
