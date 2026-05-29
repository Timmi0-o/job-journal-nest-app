export interface IJobVariantEntity {
  id: string;
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

export type ICreateJobVariantInput = Omit<
  IJobVariantEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type IUpdateJobVariantInput = Partial<ICreateJobVariantInput>;
