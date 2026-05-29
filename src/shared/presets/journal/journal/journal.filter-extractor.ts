import { FilterPresetMapperCommon } from '@shared/presets/common/common.mapper';
import type { IJournalFiltersPreset } from './journal-filters-preset.types';

export class JournalFilterExtractor {
  static extract(preset?: IJournalFiltersPreset): Record<string, unknown> {
    if (!preset) return {};

    const parts: Record<string, unknown>[] = [];

    if (preset.id?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('id', preset.id);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.jobVariantId?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'jobVariantId',
        preset.jobVariantId,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.unitId?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('unitId', preset.unitId);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.amount?.value?.length) {
      const stringValues = preset.amount.value.filter(
        (v): v is string => typeof v === 'string',
      );

      if (stringValues.length === 1) {
        parts.push({ amount: stringValues[0] });
      } else if (stringValues.length > 1) {
        parts.push({ amount: { in: stringValues } });
      }
    }

    if (preset.endDate?.value) {
      const range = FilterPresetMapperCommon.buildDateRangeFilter(
        preset.endDate.value.from,
        preset.endDate.value.to,
      );
      if (Object.keys(range).length > 0) parts.push({ endDate: range });
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
