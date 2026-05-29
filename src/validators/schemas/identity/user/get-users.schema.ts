import type { IGetUsersDto } from '@application/dtos/identity/user';
import { presetSchema, querySchemaProperties } from '@shared/schemas';
import { JSONSchemaType } from 'ajv';
import { userFiltersPresetSchema } from './user-filters-preset.schema';

export const getUsersSchema: JSONSchemaType<IGetUsersDto> = {
  type: 'object',
  properties: {
    preset: presetSchema,
    ...querySchemaProperties,
    filter: { ...userFiltersPresetSchema, nullable: true },
  },
  required: ['preset'],
  additionalProperties: false,
};
