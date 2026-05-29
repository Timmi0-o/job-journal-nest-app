import { TPresetType } from '@shared/presets';

export interface IGetByIdDto {
  id: string;
  preset?: TPresetType;
}

export interface IGetManyQueryDto<TFilter = Record<string, unknown>> {
  preset: TPresetType;
  filter?: TFilter | null;
  orderBy?: Record<string, 'asc' | 'desc'> | null;
  limit?: number | null;
  page?: number | null;
  requiredIds?: string[] | null;
}
