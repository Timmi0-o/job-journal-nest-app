import type {
  ICreateUnitDto,
  ICreateUnitResponse,
  IDeleteUnitResponse,
  IGetUnitDto,
  IGetUnitResponse,
  IGetUnitsResponse,
  IUpdateUnitDto,
  IUpdateUnitResponse,
} from '@application/dtos/catalog/unit';
import { CreateUnitUseCase } from '@application/use-cases/catalog/unit/create-unit.use-case';
import { DeleteUnitUseCase } from '@application/use-cases/catalog/unit/delete-unit.use-case';
import { GetUnitUseCase } from '@application/use-cases/catalog/unit/get-unit.use-case';
import { GetUnitsUseCase } from '@application/use-cases/catalog/unit/get-units.use-case';
import { UpdateUnitUseCase } from '@application/use-cases/catalog/unit/update-unit.use-case';
import { splitArrayQueryParams } from '@application/use-cases/helpers';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { IUnitFiltersPreset } from '@shared/presets';

@Controller({ path: 'units', version: '1' })
export class UnitController {
  constructor(
    private readonly getUnitUseCase: GetUnitUseCase,
    private readonly getUnitsUseCase: GetUnitsUseCase,
    private readonly createUnitUseCase: CreateUnitUseCase,
    private readonly updateUnitUseCase: UpdateUnitUseCase,
    private readonly deleteUnitUseCase: DeleteUnitUseCase,
  ) {}

  @Get()
  async getUnits(
    @Query() query: Record<string, unknown>,
  ): Promise<IGetUnitsResponse> {
    return this.getUnitsUseCase.execute(
      splitArrayQueryParams<IUnitFiltersPreset>(query),
    );
  }

  @Get(':id')
  async getUnit(
    @Param('id') id: string,
    @Query() query: Pick<IGetUnitDto, 'preset'>,
  ): Promise<IGetUnitResponse> {
    return this.getUnitUseCase.execute({ id, preset: query.preset });
  }

  @Post()
  async createUnit(@Body() data: ICreateUnitDto): Promise<ICreateUnitResponse> {
    return this.createUnitUseCase.execute(data);
  }

  @Patch(':id')
  async updateUnit(
    @Param('id') id: string,
    @Body() data: Omit<IUpdateUnitDto, 'id'>,
  ): Promise<IUpdateUnitResponse> {
    return this.updateUnitUseCase.execute({ id, ...data });
  }

  @Delete(':id')
  async deleteUnit(@Param('id') id: string): Promise<IDeleteUnitResponse> {
    return this.deleteUnitUseCase.execute({ id });
  }
}
