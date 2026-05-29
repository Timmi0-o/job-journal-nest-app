export interface IUnitEntity {
  id: string;
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

export type ICreateUnitInput = Omit<IUnitEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type IUpdateUnitInput = Partial<ICreateUnitInput>;
