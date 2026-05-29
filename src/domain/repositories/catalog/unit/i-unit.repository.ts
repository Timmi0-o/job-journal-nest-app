import {
  ICreateUnitInput,
  IUnitEntity,
  IUpdateUnitInput,
} from '@domain/entities/catalog/unit/i-unit.entity';
import { ICommonRepository } from '@domain/repositories/i-common.repository';

export const UNIT_REPOSITORY_TOKEN = Symbol('UNIT_REPOSITORY_TOKEN');

export interface IUnitRepository extends ICommonRepository<
  IUnitEntity,
  ICreateUnitInput,
  IUpdateUnitInput,
  undefined
> {
  findOneByName(name: string): Promise<IUnitEntity | null>;
}
