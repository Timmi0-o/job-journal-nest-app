import {
  ICreateCurrencyInput,
  ICurrencyEntity,
  IUpdateCurrencyInput,
} from '@domain/entities/catalog/currency/i-currency.entity';
import { ICommonRepository } from '@domain/repositories/i-common.repository';

export const CURRENCY_REPOSITORY_TOKEN = Symbol('CURRENCY_REPOSITORY_TOKEN');

export interface ICurrencyRepository extends ICommonRepository<
  ICurrencyEntity,
  ICreateCurrencyInput,
  IUpdateCurrencyInput,
  undefined
> {
  findOneByCode(code: string): Promise<ICurrencyEntity | null>;
}
