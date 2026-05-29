import type { IDeleteJobVariantDto } from '@application/dtos/job/job-variant';
import { idSchema } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const deleteJobVariantSchema: JSONSchemaType<IDeleteJobVariantDto> = {
  type: 'object',
  properties: {
    id: idSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
