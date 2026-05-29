import type { IGetJobVariantDto } from '@application/dtos/job/job-variant';
import { idSchema, optionalPresetSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const getJobVariantSchema: JSONSchemaType<IGetJobVariantDto> = {
  type: 'object',
  properties: {
    id: idSchema,
    preset: optionalPresetSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
