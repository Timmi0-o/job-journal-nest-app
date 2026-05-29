export interface IFilterWithArrayValue {
  value: (string | number)[];
}

export interface IStatusFilterValue {
  value: boolean;
}

export interface ISearchFilterValue {
  value: string;
}

export interface IDateRangeValue {
  from?: string;
  to?: string;
}

export interface IDateRangeFilter {
  value: IDateRangeValue;
}

export interface IStringArrayFilter {
  value: string[];
  mode?: 'OR' | 'AND' | null;
}

export interface ITextSearchFilterPreset {
  value: string;
  mode?: 'STRICT' | 'PARTIAL' | null;
}

export interface IDateRangeArrayFilterItem {
  lt?: string | null;
  lte?: string | null;
  gt?: string | null;
  gte?: string | null;
}

export interface IDateRangeArrayFilter {
  value: IDateRangeArrayFilterItem[];
}

export interface INumberRangeArrayFilterItem {
  lt?: number | null;
  lte?: number | null;
  gt?: number | null;
  gte?: number | null;
}

export interface INumberRangeArrayFilter {
  value: INumberRangeArrayFilterItem[];
}
