import { IGetByIdDto, IGetManyQueryDto, IGetManyResponse } from '@application/dtos/common';
import {
  ICreateJobVariantInput,
  IJobVariantEntity,
  IUpdateJobVariantInput,
} from '@domain/entities/job/job-variant/i-job-variant.entity';
import { IJobVariantFiltersPreset } from '@shared/presets';

export type IGetJobVariantDto = IGetByIdDto;

export type IGetJobVariantsDto = IGetManyQueryDto<IJobVariantFiltersPreset>;

export type ICreateJobVariantDto = ICreateJobVariantInput;

export type IUpdateJobVariantDto = { id: string } & IUpdateJobVariantInput;

export type IDeleteJobVariantDto = { id: string };

export type IGetJobVariantResponse = IJobVariantEntity;

export type IGetJobVariantsResponse = IGetManyResponse<IJobVariantEntity>;

export type ICreateJobVariantResponse = IJobVariantEntity;

export type IUpdateJobVariantResponse = IJobVariantEntity;

export type IDeleteJobVariantResponse = boolean;
