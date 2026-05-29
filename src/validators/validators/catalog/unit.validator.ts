import type {
  ICreateUnitDto,
  IDeleteUnitDto,
  IGetUnitDto,
  IGetUnitsDto,
  IUpdateUnitDto,
} from '@application/dtos/catalog/unit';
import type { IUnitValidator } from '@domain/validators/catalog/unit';
import { Logger } from '@nestjs/common';
import {
  createUnitSchema,
  deleteUnitSchema,
  getUnitSchema,
  getUnitsSchema,
  updateUnitSchema,
} from '@validators/schemas/catalog/unit';
import { ajv, ajvStrict } from '../ajv-instance';
import { BaseValidator } from '../base.validator';

const validateGetOne = ajv.compile(getUnitSchema);
const validateGetMany = ajv.compile(getUnitsSchema);
const validateCreate = ajvStrict.compile(createUnitSchema);
const validateUpdate = ajvStrict.compile(updateUnitSchema);
const validateDelete = ajv.compile(deleteUnitSchema);

export class UnitValidator extends BaseValidator implements IUnitValidator {
  constructor() {
    super(new Logger(UnitValidator.name));
  }

  validateGetOne(data: IGetUnitDto): IGetUnitDto {
    return this.validateAndReturn({
      validate: validateGetOne,
      data,
      errorMessage: 'Произошла ошибка при валидации данных единицы измерения',
      logLabel: 'get unit',
    });
  }

  validateGetMany(data: IGetUnitsDto): IGetUnitsDto {
    return this.validateAndReturn({
      validate: validateGetMany,
      data,
      errorMessage: 'Произошла ошибка при валидации списка единиц измерения',
      logLabel: 'get units',
    });
  }

  validateCreate(data: ICreateUnitDto): ICreateUnitDto {
    return this.validateAndReturn({
      validate: validateCreate,
      data,
      errorMessage: 'Произошла ошибка при валидации данных создания единицы измерения',
      logLabel: 'create unit',
    });
  }

  validateUpdate(data: IUpdateUnitDto): IUpdateUnitDto {
    return this.validateAndReturn({
      validate: validateUpdate,
      data,
      errorMessage: 'Произошла ошибка при валидации данных обновления единицы измерения',
      logLabel: 'update unit',
    });
  }

  validateDelete(data: IDeleteUnitDto): IDeleteUnitDto {
    return this.validateAndReturn({
      validate: validateDelete,
      data,
      errorMessage: 'Произошла ошибка при валидации данных удаления единицы измерения',
      logLabel: 'delete unit',
    });
  }
}
