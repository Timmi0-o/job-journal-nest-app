export interface IPaginationMeta {
  total: number;
  totalCount: number;
  offset: number;
  limit: number;
  page?: number;
}

export interface IGetManyResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}
