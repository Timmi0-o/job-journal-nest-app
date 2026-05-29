import type {
  IDateRangeFilter,
  ISearchFilterValue,
  IStringArrayFilter,
} from '@shared/presets/common/common.types';

export interface IUserFiltersPreset {
  search?: ISearchFilterValue;
  id?: IStringArrayFilter;
  email?: IStringArrayFilter;
  phone?: IStringArrayFilter;
  status?: IStringArrayFilter;
  role?: IStringArrayFilter;
  createdAt?: IDateRangeFilter;
  updatedAt?: IDateRangeFilter;
}
