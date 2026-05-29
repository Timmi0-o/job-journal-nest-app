import { UserRole } from '@domain/entities/identity/user/user-role.enum';
import { UserStatus } from '@domain/entities/identity/user/user-status.enum';
import type { IUserFiltersPreset } from '@shared/presets';
import {
  dateRangeFilterSchema,
  filterEnumArraySchema,
  filterStringArraySchema,
  searchFilterValueSchema,
} from '@shared/schemas';
import { JSONSchemaType } from 'ajv';

export const userFiltersPresetSchema: JSONSchemaType<IUserFiltersPreset> = {
  type: 'object',
  properties: {
    search: { ...searchFilterValueSchema, nullable: true },
    id: { ...filterStringArraySchema, nullable: true },
    email: { ...filterStringArraySchema, nullable: true },
    phone: { ...filterStringArraySchema, nullable: true },
    status: { ...filterEnumArraySchema(Object.values(UserStatus)), nullable: true },
    role: { ...filterEnumArraySchema(Object.values(UserRole)), nullable: true },
    createdAt: { ...dateRangeFilterSchema, nullable: true },
    updatedAt: { ...dateRangeFilterSchema, nullable: true },
  },
  required: [],
  additionalProperties: false,
};
