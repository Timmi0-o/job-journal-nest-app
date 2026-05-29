import type { IUnitEntity } from '@domain/entities/catalog/unit/i-unit.entity';
import { PresetConfig } from '@shared/presets/common/presets-base.types';
import { createPresetGetter, isValidPreset } from '@shared/presets/common/presets.helpers';
import { TPresetType } from '@shared/presets/common/types';

export type IUnitPresetConfig = PresetConfig<IUnitEntity>;

export type IUnitPresets = {
  [K in TPresetType]: IUnitPresetConfig;
};

export const UNIT_PRESETS: IUnitPresets = {
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

export const getUnitPresetConfig = createPresetGetter(UNIT_PRESETS);

export const isValidUnitPreset = isValidPreset;
