export interface IJournalEntity {
  id: string;
  jobVariantId: string;
  amount: string;
  unitId: string;
  endDate: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type ICreateJournalInput = Omit<
  IJournalEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type IUpdateJournalInput = Partial<ICreateJournalInput>;
