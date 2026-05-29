import type {
  IDateRangeFilter,
  ISearchFilterValue,
  IStringArrayFilter,
} from '@shared/presets/common/common.types';

export interface IJobVariantFiltersPreset {
  search?: ISearchFilterValue;
  id?: IStringArrayFilter;
  name?: IStringArrayFilter;
  createdAt?: IDateRangeFilter;
  updatedAt?: IDateRangeFilter;
}
