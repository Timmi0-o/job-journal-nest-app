import type { IJournalEntity } from '@domain/entities/journal/journal/i-journal.entity';
import {
  NestedIncludeBase,
  PresetConfig,
} from '@shared/presets/common/presets-base.types';
import {
  createPresetGetter,
  isValidPreset,
} from '@shared/presets/common/presets.helpers';
import { TPresetType } from '@shared/presets/common/types';

export type IJournalInclude = {
  unit?: NestedIncludeBase;
  jobVariant?: NestedIncludeBase;
};

export type IJournalPresetConfig = PresetConfig<
  IJournalEntity,
  IJournalInclude
>;

export type IJournalPresets = {
  [K in TPresetType]: IJournalPresetConfig;
};

export const JOURNAL_PRESETS: IJournalPresets = {
  MINIMAL: {
    select: ['id', 'jobVariantId', 'unitId', 'amount', 'endDate'],
  },

  SHORT: {
    select: [
      'id',
      'jobVariantId',
      'unitId',
      'amount',
      'endDate',
      'createdAt',
      'updatedAt',
    ],
  },

  BASE: {
    select: [
      'id',
      'jobVariantId',
      'unitId',
      'amount',
      'endDate',
      'createdAt',
      'updatedAt',
    ],
    include: {
      unit: {
        select: ['id', 'name'],
      },
      jobVariant: {
        select: ['id', 'name'],
      },
    },
  },
};

export const getJournalPresetConfig = createPresetGetter(JOURNAL_PRESETS);

export const isValidJournalPreset = isValidPreset;
