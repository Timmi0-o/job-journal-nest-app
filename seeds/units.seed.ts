import { seedUuid } from './seed-helpers';

export interface SeedUnit {
  id: string;
  name: string;
}

export const UNITS_SEED: SeedUnit[] = [
  { id: seedUuid(20000000, 1), name: 'м²' },
  { id: seedUuid(20000000, 2), name: 'м³' },
  { id: seedUuid(20000000, 3), name: 'п.м.' },
  { id: seedUuid(20000000, 4), name: 'м' },
  { id: seedUuid(20000000, 5), name: 'шт' },
  { id: seedUuid(20000000, 6), name: 'т' },
  { id: seedUuid(20000000, 7), name: 'кг' },
  { id: seedUuid(20000000, 8), name: 'компл' },
  { id: seedUuid(20000000, 9), name: 'чел.-ч' },
  { id: seedUuid(20000000, 10), name: 'маш.-ч' },
  { id: seedUuid(20000000, 11), name: 'л' },
  { id: seedUuid(20000000, 12), name: 'упак' },
  { id: seedUuid(20000000, 13), name: '%' },
  { id: seedUuid(20000000, 14), name: '100 м²' },
  { id: seedUuid(20000000, 15), name: 'км' },
  { id: seedUuid(20000000, 16), name: 'га' },
  { id: seedUuid(20000000, 17), name: 'м²·сут' },
  { id: seedUuid(20000000, 18), name: 'рул' },
];
