import { CreateUnitUseCase } from '@application/use-cases/catalog/unit/create-unit.use-case';
import { DeleteUnitUseCase } from '@application/use-cases/catalog/unit/delete-unit.use-case';
import { GetUnitUseCase } from '@application/use-cases/catalog/unit/get-unit.use-case';
import { GetUnitsUseCase } from '@application/use-cases/catalog/unit/get-units.use-case';
import {
  EnsureUnitExistsHelper,
  UnitWriteHelper,
} from '@application/use-cases/catalog/unit/helpers';
import { UpdateUnitUseCase } from '@application/use-cases/catalog/unit/update-unit.use-case';
import {
  IUnitRepository,
  UNIT_REPOSITORY_TOKEN,
} from '@domain/repositories/catalog/unit/i-unit.repository';
import {
  IUnitValidator,
  UNIT_VALIDATOR_TOKEN,
} from '@domain/validators/catalog/unit';
import { Module } from '@nestjs/common';
import { UnitController } from '@presentation/controllers/catalog/unit.controller';
import { UnitValidator } from '@validators/validators/catalog/unit.validator';
import { UnitRepository } from 'src/infrastructure/persistence/repositories/catalog/unit/unit.repository';

@Module({
  controllers: [UnitController],
  exports: [UNIT_REPOSITORY_TOKEN],
  providers: [
    { provide: UNIT_REPOSITORY_TOKEN, useClass: UnitRepository },
    { provide: UNIT_VALIDATOR_TOKEN, useClass: UnitValidator },
    {
      provide: EnsureUnitExistsHelper,
      useFactory: (repo: IUnitRepository) => new EnsureUnitExistsHelper(repo),
      inject: [UNIT_REPOSITORY_TOKEN],
    },
    {
      provide: UnitWriteHelper,
      useFactory: (repo: IUnitRepository) => new UnitWriteHelper(repo),
      inject: [UNIT_REPOSITORY_TOKEN],
    },
    {
      provide: GetUnitUseCase,
      useFactory: (v: IUnitValidator, h: EnsureUnitExistsHelper) =>
        new GetUnitUseCase(v, h),
      inject: [UNIT_VALIDATOR_TOKEN, EnsureUnitExistsHelper],
    },
    {
      provide: GetUnitsUseCase,
      useFactory: (v: IUnitValidator, r: IUnitRepository) =>
        new GetUnitsUseCase(v, r),
      inject: [UNIT_VALIDATOR_TOKEN, UNIT_REPOSITORY_TOKEN],
    },
    {
      provide: CreateUnitUseCase,
      useFactory: (v: IUnitValidator, r: IUnitRepository, w: UnitWriteHelper) =>
        new CreateUnitUseCase(v, r, w),
      inject: [UNIT_VALIDATOR_TOKEN, UNIT_REPOSITORY_TOKEN, UnitWriteHelper],
    },
    {
      provide: UpdateUnitUseCase,
      useFactory: (
        v: IUnitValidator,
        r: IUnitRepository,
        e: EnsureUnitExistsHelper,
        w: UnitWriteHelper,
      ) => new UpdateUnitUseCase(v, r, e, w),
      inject: [
        UNIT_VALIDATOR_TOKEN,
        UNIT_REPOSITORY_TOKEN,
        EnsureUnitExistsHelper,
        UnitWriteHelper,
      ],
    },
    {
      provide: DeleteUnitUseCase,
      useFactory: (
        v: IUnitValidator,
        r: IUnitRepository,
        e: EnsureUnitExistsHelper,
      ) => new DeleteUnitUseCase(v, r, e),
      inject: [
        UNIT_VALIDATOR_TOKEN,
        UNIT_REPOSITORY_TOKEN,
        EnsureUnitExistsHelper,
      ],
    },
  ],
})
export class UnitModule {}
