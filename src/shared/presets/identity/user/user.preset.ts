import type { IUserEntity } from '@domain/entities/identity/user/i-user.entity';
import { PresetConfig } from '@shared/presets/common/presets-base.types';
import {
  createPresetGetter,
  isValidPreset,
} from '@shared/presets/common/presets.helpers';
import { TPresetType } from '@shared/presets/common/types';

export type IUserPresetConfig = PresetConfig<IUserEntity>;

export type IUserPresets = {
  [K in TPresetType]: IUserPresetConfig;
};

export const USER_PRESETS: IUserPresets = {
  MINIMAL: {
    select: ['id', 'email', 'surname', 'name'],
  },

  SHORT: {
    select: [
      'id',
      'email',
      'surname',
      'name',
      'patronymic',
      'phone',
      'status',
      'role',
      'createdAt',
      'updatedAt',
    ],
  },

  BASE: {
    select: [
      'id',
      'surname',
      'name',
      'patronymic',
      'email',
      'phone',
      'status',
      'role',
      'createdAt',
      'updatedAt',
    ],
  },
};

export const getUserPresetConfig = createPresetGetter(USER_PRESETS);

export const isValidUserPreset = isValidPreset;
