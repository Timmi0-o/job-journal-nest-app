import {
  ICreateUnitDto,
  IDeleteUnitDto,
  IGetUnitDto,
  IGetUnitsDto,
  IUpdateUnitDto,
} from '@application/dtos/catalog/unit';
import { IEntityValidator } from '@domain/validators/i-entity-validator.interface';

export type IUnitValidator = IEntityValidator<
  IGetUnitDto,
  IGetUnitsDto,
  ICreateUnitDto,
  IUpdateUnitDto,
  IDeleteUnitDto
>;

export const UNIT_VALIDATOR_TOKEN = Symbol('UNIT_VALIDATOR_TOKEN');
