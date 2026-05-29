import { PRESET_TYPES } from '@shared/presets';
import type { Schema } from 'ajv';

export const decimalStringPattern = '^[0-9]+(\\.[0-9]+)?$';

export const minorUnitsInt32Schema = {
  type: 'integer',
  minimum: 0,
  maximum: 2_147_483_647,
} as const;

export const nullableMinorUnitsInt32Schema = {
  type: 'integer',
  nullable: true,
  minimum: 0,
  maximum: 2_147_483_647,
} as const;

export const idSchema = {
  type: 'string',
  format: 'uuid',
} as const;

export const presetSchema = {
  type: 'string',
  enum: PRESET_TYPES,
} as const;

export const optionalPresetSchema = {
  ...presetSchema,
  nullable: true,
} as const;

export const isStaffUserSchema = {
  type: 'boolean',
} as const;

export const isMemberSchema = {
  type: 'boolean',
} as const;

export const hasPermissionsSchema = {
  type: 'boolean',
} as const;

export const roleIdSchema = {
  ...idSchema,
  nullable: true,
} as const;

export const authContextSchemaProperties = {
  commonUserId: idSchema,
  isStaffUser: isStaffUserSchema,
} as const;

export const authContextSchema = {
  type: 'object' as const,
  properties: {
    commonUserId: idSchema,
    isStaffUser: isStaffUserSchema,
  },
  required: ['commonUserId', 'isStaffUser'] as const,
  additionalProperties: false as const,
};

export const membershipContextSchema = {
  type: 'object' as const,
  properties: {
    commonUserId: idSchema,
    isStaffUser: isStaffUserSchema,
    organizationId: idSchema,
    isMember: isMemberSchema,
    hasPermissions: hasPermissionsSchema,
  },
  required: [
    'commonUserId',
    'isStaffUser',
    'organizationId',
    'isMember',
    'hasPermissions',
  ] as const,
  additionalProperties: false as const,
};

export const filterSchema = {
  type: 'object',
  nullable: true,
  additionalProperties: true,
} as const;

export const orderBySchema = {
  type: 'object',
  nullable: true,
  required: [],
  additionalProperties: { type: 'string', enum: ['asc', 'desc'] as const },
} as const;

export const limitSchema = {
  type: 'number',
  minimum: 1,
  maximum: 100,
  nullable: true,
} as const;

export const pageSchema = {
  type: 'number',
  minimum: 1,
  nullable: true,
} as const;

export const offsetSchema = {
  type: 'number',
  minimum: 0,
  nullable: true,
} as const;

export const requiredIdsSchema = {
  type: 'array',
  items: idSchema,
  nullable: true,
} as const;

export const querySchemaProperties = {
  filter: filterSchema,
  orderBy: orderBySchema,
  limit: limitSchema,
  page: pageSchema,
  requiredIds: requiredIdsSchema,
} as const;

export function uuidArraySchema(options?: { minItems?: number; nullable?: boolean }): Schema {
  const { minItems = 0, nullable = false } = options ?? {};
  return {
    type: 'array',
    items: idSchema,
    ...(minItems > 0 && { minItems }),
    ...(nullable && { nullable: true }),
  };
}
