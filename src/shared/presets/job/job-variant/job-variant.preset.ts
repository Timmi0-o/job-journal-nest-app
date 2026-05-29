import type { IJobVariantEntity } from '@domain/entities/job/job-variant/i-job-variant.entity';
import { PresetConfig } from '@shared/presets/common/presets-base.types';
import { createPresetGetter, isValidPreset } from '@shared/presets/common/presets.helpers';
import { TPresetType } from '@shared/presets/common/types';

export type IJobVariantPresetConfig = PresetConfig<IJobVariantEntity>;

export type IJobVariantPresets = {
  [K in TPresetType]: IJobVariantPresetConfig;
};

export const JOB_VARIANT_PRESETS: IJobVariantPresets = {
  MINIMAL: {
    select: ['id', 'name'],
  },

  SHORT: {
    select: ['id', 'name', 'createdAt', 'updatedAt'],
  },

  BASE: {
    select: ['id', 'name', 'createdAt', 'updatedAt'],
  },
};

export const getJobVariantPresetConfig = createPresetGetter(JOB_VARIANT_PRESETS);

export const isValidJobVariantPreset = isValidPreset;
