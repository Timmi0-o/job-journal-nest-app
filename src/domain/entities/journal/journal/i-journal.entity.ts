import type { IUnitEntity } from '@domain/entities/catalog/unit/i-unit.entity';
import type { IJobVariantEntity } from '@domain/entities/job/job-variant/i-job-variant.entity';

export interface IJournalRelations {
  unit: IUnitEntity;
  jobVariant: IJobVariantEntity;
}

export interface IJournalEntity {
  id: string;
  jobVariantId: string;
  amount: string;
  unitId: string;
  endDate: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type IJournalIncludedRelations = {
  unit: Pick<IUnitEntity, 'id' | 'name'>;
  jobVariant: Pick<IJobVariantEntity, 'id' | 'name'>;
};

export type IJournalWithRelations = IJournalEntity & Partial<IJournalIncludedRelations>;

export type ICreateJournalInput = Omit<
  IJournalEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type IUpdateJournalInput = Partial<ICreateJournalInput>;
