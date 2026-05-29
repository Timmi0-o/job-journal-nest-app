export interface ICurrencyEntity {
  id: string;
  name: string;
  code: string;
  numericCode: number;
  symbol: string;
  decimalPlaces: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type ICreateCurrencyInput = Omit<
  ICurrencyEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUpdateCurrencyInput = Omit<Partial<ICreateCurrencyInput>, 'deletedAt'>;
