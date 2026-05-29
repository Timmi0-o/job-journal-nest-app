import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

export interface IUserEntity {
  id: string;
  surname: string;
  name: string;
  patronymic: string | null;
  email: string;
  phone: string | null;
  status: UserStatus;
  role: UserRole;
  passwordHash: string;

  createdAt: Date;
  updatedAt: Date;
}

export type ICreateUserInput = Omit<
  IUserEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type IUpdateUserInput = Partial<ICreateUserInput>;
