import { PRESET_TYPES, TPresetType } from './types';

/**
 * Создает функцию-геттер для получения конфигурации preset
 * @param presets - объект с конфигурациями всех presets
 * @returns функция для получения конфигурации по типу preset
 */
export function createPresetGetter<TConfig>(
  presets: Record<TPresetType, TConfig>,
): (preset: TPresetType) => TConfig {
  return (preset: TPresetType): TConfig => presets[preset];
}

/**
 * Проверяет, является ли строка валидным типом preset
 * @param preset - строка для проверки
 * @returns true если строка является валидным TPresetType
 */
export function isValidPreset(preset: string): preset is TPresetType {
  return PRESET_TYPES.includes(preset as TPresetType);
}
