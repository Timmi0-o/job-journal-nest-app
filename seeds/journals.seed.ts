import { JOB_VARIANTS_SEED } from './job-variants.seed';
import { seedUuid } from './seed-helpers';
import { UNITS_SEED } from './units.seed';

export interface SeedJournal {
  id: string;
  jobVariantId: string;
  unitId: string;
  amount: string;
  endDate: Date;
}

const JOURNAL_ENTRIES: Array<{
  jobVariantIndex: number;
  unitIndex: number;
  amount: string;
  endDate: string;
}> = [
  {
    jobVariantIndex: 0,
    unitIndex: 1,
    amount: '1240.50',
    endDate: '2025-11-15',
  },
  { jobVariantIndex: 1, unitIndex: 1, amount: '320.00', endDate: '2025-11-18' },
  { jobVariantIndex: 2, unitIndex: 1, amount: '890.75', endDate: '2025-11-22' },
  {
    jobVariantIndex: 10,
    unitIndex: 1,
    amount: '456.20',
    endDate: '2025-12-01',
  },
  {
    jobVariantIndex: 11,
    unitIndex: 1,
    amount: '2100.00',
    endDate: '2025-12-05',
  },
  {
    jobVariantIndex: 12,
    unitIndex: 1,
    amount: '780.30',
    endDate: '2025-12-08',
  },
  {
    jobVariantIndex: 20,
    unitIndex: 0,
    amount: '1850.00',
    endDate: '2025-12-12',
  },
  {
    jobVariantIndex: 21,
    unitIndex: 0,
    amount: '960.40',
    endDate: '2025-12-15',
  },
  {
    jobVariantIndex: 22,
    unitIndex: 0,
    amount: '1340.00',
    endDate: '2025-12-18',
  },
  { jobVariantIndex: 25, unitIndex: 4, amount: '48.00', endDate: '2025-12-20' },
  { jobVariantIndex: 30, unitIndex: 5, amount: '12.50', endDate: '2026-01-05' },
  { jobVariantIndex: 31, unitIndex: 5, amount: '8.75', endDate: '2026-01-08' },
  {
    jobVariantIndex: 34,
    unitIndex: 0,
    amount: '620.00',
    endDate: '2026-01-10',
  },
  {
    jobVariantIndex: 35,
    unitIndex: 0,
    amount: '410.25',
    endDate: '2026-01-12',
  },
  {
    jobVariantIndex: 36,
    unitIndex: 0,
    amount: '980.00',
    endDate: '2026-01-15',
  },
  {
    jobVariantIndex: 40,
    unitIndex: 0,
    amount: '1520.60',
    endDate: '2026-01-18',
  },
  {
    jobVariantIndex: 41,
    unitIndex: 0,
    amount: '730.00',
    endDate: '2026-01-20',
  },
  {
    jobVariantIndex: 45,
    unitIndex: 0,
    amount: '2250.00',
    endDate: '2026-01-22',
  },
  { jobVariantIndex: 50, unitIndex: 4, amount: '36.00', endDate: '2026-01-25' },
  { jobVariantIndex: 51, unitIndex: 4, amount: '18.00', endDate: '2026-01-28' },
  { jobVariantIndex: 52, unitIndex: 7, amount: '2.00', endDate: '2026-02-01' },
  {
    jobVariantIndex: 55,
    unitIndex: 2,
    amount: '540.00',
    endDate: '2026-02-03',
  },
  {
    jobVariantIndex: 58,
    unitIndex: 0,
    amount: '3120.00',
    endDate: '2026-02-05',
  },
  {
    jobVariantIndex: 59,
    unitIndex: 0,
    amount: '890.00',
    endDate: '2026-02-08',
  },
  {
    jobVariantIndex: 62,
    unitIndex: 0,
    amount: '1675.50',
    endDate: '2026-02-10',
  },
  {
    jobVariantIndex: 65,
    unitIndex: 0,
    amount: '420.00',
    endDate: '2026-02-12',
  },
  {
    jobVariantIndex: 68,
    unitIndex: 0,
    amount: '980.75',
    endDate: '2026-02-15',
  },
  {
    jobVariantIndex: 70,
    unitIndex: 0,
    amount: '650.00',
    endDate: '2026-02-18',
  },
  {
    jobVariantIndex: 73,
    unitIndex: 0,
    amount: '1120.00',
    endDate: '2026-02-20',
  },
  {
    jobVariantIndex: 76,
    unitIndex: 0,
    amount: '340.00',
    endDate: '2026-02-22',
  },
  {
    jobVariantIndex: 80,
    unitIndex: 2,
    amount: '860.00',
    endDate: '2026-02-25',
  },
  { jobVariantIndex: 83, unitIndex: 4, amount: '24.00', endDate: '2026-02-28' },
  { jobVariantIndex: 86, unitIndex: 4, amount: '12.00', endDate: '2026-03-01' },
  {
    jobVariantIndex: 90,
    unitIndex: 2,
    amount: '1240.00',
    endDate: '2026-03-03',
  },
  { jobVariantIndex: 93, unitIndex: 4, amount: '32.00', endDate: '2026-03-05' },
  {
    jobVariantIndex: 96,
    unitIndex: 8,
    amount: '480.00',
    endDate: '2026-03-08',
  },
  {
    jobVariantIndex: 99,
    unitIndex: 8,
    amount: '320.00',
    endDate: '2026-03-10',
  },
  {
    jobVariantIndex: 102,
    unitIndex: 3,
    amount: '2150.00',
    endDate: '2026-03-12',
  },
  {
    jobVariantIndex: 108,
    unitIndex: 0,
    amount: '760.00',
    endDate: '2026-03-15',
  },
  {
    jobVariantIndex: 112,
    unitIndex: 0,
    amount: '540.00',
    endDate: '2026-03-18',
  },
];

function buildJournals(): SeedJournal[] {
  return JOURNAL_ENTRIES.map((entry, index) => ({
    id: seedUuid(40000000, index + 1),
    jobVariantId: JOB_VARIANTS_SEED[entry.jobVariantIndex].id,
    unitId: UNITS_SEED[entry.unitIndex].id,
    amount: entry.amount,
    endDate: new Date(`${entry.endDate}T12:00:00.000Z`),
  }));
}

export const JOURNALS_SEED = buildJournals();
