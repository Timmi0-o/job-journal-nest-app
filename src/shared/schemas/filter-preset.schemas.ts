import {
  ENUM_ARRAY_MAX_ITEMS,
  FILTER_STRING_ITEM_MAX_LENGTH,
  STRING_ARRAY_MAX_ITEMS,
  UUID_ARRAY_MAX_ITEMS,
} from '@shared/constants';
import type {
  IDateRangeArrayFilter,
  IDateRangeFilter,
  IFilterWithArrayValue,
  INumberRangeArrayFilter,
  ISearchFilterValue,
  IStatusFilterValue,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from '@shared/presets';
import { JSONSchemaType } from 'ajv';
import { idSchema } from './common.schemas';

export const modeFilterSchema = {
  type: 'string' as const,
  enum: ['OR', 'AND'] as const,
  nullable: true as const,
};

export type FilterEnumArraySchemaResult = {
  type: 'object';
  properties: {
    value: {
      type: 'array';
      items: { type: 'string'; enum: string[] };
      minItems: number;
      maxItems: number;
    };
    mode: typeof modeFilterSchema;
  };
  required: ['value'];
  additionalProperties: false;
};

export function filterEnumArraySchema(enumValues: readonly string[]): FilterEnumArraySchemaResult {
  return {
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: { type: 'string', enum: [...enumValues] },
        minItems: 1,
        maxItems: ENUM_ARRAY_MAX_ITEMS,
      },
      mode: modeFilterSchema,
    },
    required: ['value'],
    additionalProperties: false,
  };
}

export const filterUuidArraySchema: JSONSchemaType<IStringArrayFilter> = {
  type: 'object',
  properties: {
    value: {
      type: 'array',
      items: idSchema,
      minItems: 1,
      maxItems: UUID_ARRAY_MAX_ITEMS,
    },
    mode: modeFilterSchema,
  },
  required: ['value'],
  additionalProperties: false,
};

export const filterStringArraySchema: JSONSchemaType<IStringArrayFilter> = {
  type: 'object',
  properties: {
    value: {
      type: 'array',
      items: { type: 'string', maxLength: FILTER_STRING_ITEM_MAX_LENGTH },
      minItems: 1,
      maxItems: STRING_ARRAY_MAX_ITEMS,
    },
    mode: modeFilterSchema,
  },
  required: ['value'],
  additionalProperties: false,
};

export const SEARCH_MAX_LENGTH = 500;

export const textSearchFilterModeSchema = {
  type: 'string' as const,
  enum: ['STRICT', 'PARTIAL'] as const,
  nullable: true as const,
};

export const searchFilterValueSchema: JSONSchemaType<ISearchFilterValue> = {
  type: 'object',
  properties: {
    value: {
      type: 'string',
      minLength: 1,
      maxLength: SEARCH_MAX_LENGTH,
    },
  },
  required: ['value'],
  additionalProperties: false,
};

export const textSearchFilterPresetSchema: JSONSchemaType<ITextSearchFilterPreset> = {
  type: 'object',
  properties: {
    value: {
      type: 'string',
      minLength: 1,
      maxLength: SEARCH_MAX_LENGTH,
    },
    mode: textSearchFilterModeSchema,
  },
  required: ['value'],
  additionalProperties: false,
};

export const dateRangeArrayFilterSchema: JSONSchemaType<IDateRangeArrayFilter> = {
  type: 'object',
  properties: {
    value: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          lt: { type: 'string', format: 'date-time', nullable: true },
          lte: { type: 'string', format: 'date-time', nullable: true },
          gt: { type: 'string', format: 'date-time', nullable: true },
          gte: { type: 'string', format: 'date-time', nullable: true },
        },
        required: [],
        additionalProperties: false,
      },
      minItems: 1,
    },
  },
  required: ['value'],
  additionalProperties: false,
};

export const numberRangeArrayFilterSchema: JSONSchemaType<INumberRangeArrayFilter> = {
  type: 'object',
  properties: {
    value: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          lt: { type: 'number', nullable: true },
          lte: { type: 'number', nullable: true },
          gt: { type: 'number', nullable: true },
          gte: { type: 'number', nullable: true },
        },
        required: [],
        additionalProperties: false,
      },
      minItems: 1,
    },
  },
  required: ['value'],
  additionalProperties: false,
};

export const dateRangeFilterSchema: JSONSchemaType<IDateRangeFilter> = {
  type: 'object',
  properties: {
    value: {
      type: 'object',
      properties: {
        from: { type: 'string', format: 'date-time', nullable: true },
        to: { type: 'string', format: 'date-time', nullable: true },
      },
      required: [],
      additionalProperties: false,
    },
  },
  required: ['value'],
  additionalProperties: false,
};

export const filterWithArrayValueSchema: JSONSchemaType<IFilterWithArrayValue> = {
  type: 'object',
  properties: {
    value: {
      type: 'array',
      items: {
        anyOf: [{ type: 'string' }, { type: 'number' }],
      },
      minItems: 1,
    },
  },
  required: ['value'],
  additionalProperties: false,
};

export const statusFilterValueSchema: JSONSchemaType<IStatusFilterValue> = {
  type: 'object',
  properties: {
    value: { type: 'boolean' },
  },
  required: ['value'],
  additionalProperties: false,
};
