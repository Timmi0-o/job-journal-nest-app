import type {
  IDateRangeFilter,
  IFilterWithArrayValue,
  IStringArrayFilter,
} from '@shared/presets/common/common.types';

export interface IJournalFiltersPreset {
  id?: IStringArrayFilter;
  jobVariantId?: IStringArrayFilter;
  unitId?: IStringArrayFilter;
  amount?: IFilterWithArrayValue;
  endDate?: IDateRangeFilter;
  createdAt?: IDateRangeFilter;
  updatedAt?: IDateRangeFilter;
}
