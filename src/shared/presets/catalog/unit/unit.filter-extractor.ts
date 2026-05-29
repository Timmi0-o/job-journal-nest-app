import { FilterPresetMapperCommon } from '@shared/presets/common/common.mapper';
import type { IUnitFiltersPreset } from './unit-filters-preset.types';

export class UnitFilterExtractor {
  static extract(preset?: IUnitFiltersPreset): Record<string, unknown> {
    if (!preset) return {};

    const parts: Record<string, unknown>[] = [];

    if (preset.search?.value) {
      const f = FilterPresetMapperCommon.mapSearchByFields(preset.search.value, ['name']);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.id?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('id', preset.id);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.name?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('name', preset.name);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.createdAt?.value) {
      const range = FilterPresetMapperCommon.buildDateRangeFilter(
        preset.createdAt.value.from,
        preset.createdAt.value.to,
      );
      if (Object.keys(range).length > 0) parts.push({ createdAt: range });
    }

    if (preset.updatedAt?.value) {
      const range = FilterPresetMapperCommon.buildDateRangeFilter(
        preset.updatedAt.value.from,
        preset.updatedAt.value.to,
      );
      if (Object.keys(range).length > 0) parts.push({ updatedAt: range });
    }

    if (parts.length === 0) return {};
    if (parts.length === 1) return parts[0];

    return { AND: parts };
  }
}
