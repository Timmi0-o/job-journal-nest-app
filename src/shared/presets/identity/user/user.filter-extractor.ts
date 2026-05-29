import { FilterPresetMapperCommon } from '@shared/presets/common/common.mapper';
import type { IUserFiltersPreset } from './user-filters-preset.types';

export class UserFilterExtractor {
  static extract(preset?: IUserFiltersPreset): Record<string, unknown> {
    if (!preset) return {};

    const parts: Record<string, unknown>[] = [];

    if (preset.search?.value) {
      const f = FilterPresetMapperCommon.mapSearchByFields(
        preset.search.value,
        ['surname', 'name', 'patronymic', 'email', 'phone'],
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.id?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('id', preset.id);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.email?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'email',
        preset.email,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.phone?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'phone',
        preset.phone,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.status?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'status',
        preset.status,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.role?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'role',
        preset.role,
      );
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
