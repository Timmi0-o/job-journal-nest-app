import { IGetByIdDto, IGetManyQueryDto } from '@application/dtos/common';
import {
  ICreateUnitInput,
  IUnitEntity,
  IUpdateUnitInput,
} from '@domain/entities/catalog/unit/i-unit.entity';
import { IUnitFiltersPreset } from '@shared/presets';

export type IGetUnitDto = IGetByIdDto;

export type IGetUnitsDto = IGetManyQueryDto<IUnitFiltersPreset>;

export type ICreateUnitDto = ICreateUnitInput;

export type IUpdateUnitDto = { id: string } & IUpdateUnitInput;

export type IDeleteUnitDto = { id: string };

export type IUnitResponse = IUnitEntity;
