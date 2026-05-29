import { Role, Status } from '../prisma/generated/client';
import { SEED_PASSWORD_HASH, seedUuid } from './seed-helpers';

export interface SeedUser {
  id: string;
  surname: string;
  name: string;
  patronymic: string | null;
  email: string;
  phone: string | null;
  status: Status;
  role: Role;
  passwordHash: string;
}

const FIRST_NAMES = [
  'Александр',
  'Мария',
  'Дмитрий',
  'Елена',
  'Игорь',
  'Анна',
  'Павел',
  'Ольга',
  'Сергей',
  'Наталья',
  'Андрей',
  'Татьяна',
  'Николай',
  'Екатерина',
  'Михаил',
];

const SURNAMES = [
  'Иванов',
  'Петрова',
  'Смирнов',
  'Кузнецова',
  'Волков',
  'Соколова',
  'Морозов',
  'Лебедева',
  'Орлов',
  'Романова',
  'Козлов',
  'Новикова',
  'Егоров',
  'Павлова',
  'Степанов',
];

const PATRONYMICS = [
  'Александрович',
  'Сергеевна',
  'Дмитриевич',
  'Игоревна',
  'Павлович',
  'Андреевна',
  'Николаевич',
  'Михайловна',
  'Владимирович',
  'Олеговна',
];

function buildUsers(): SeedUser[] {
  const users: SeedUser[] = [
    {
      id: seedUuid(10000000, 1),
      surname: 'Администратор',
      name: 'Системный',
      patronymic: null,
      email: 'admin@job-journal.seed',
      phone: '+79000000001',
      status: Status.ACTIVE,
      role: Role.SUPER_ADMIN,
      passwordHash: SEED_PASSWORD_HASH,
    },
    {
      id: seedUuid(10000000, 2),
      surname: 'Руководитель',
      name: 'Главный',
      patronymic: 'Петрович',
      email: 'superadmin@job-journal.seed',
      phone: '+79000000002',
      status: Status.ACTIVE,
      role: Role.SUPER_ADMIN,
      passwordHash: SEED_PASSWORD_HASH,
    },
    {
      id: seedUuid(10000000, 3),
      surname: 'Козлов',
      name: 'Артём',
      patronymic: 'Иванович',
      email: 'manager@job-journal.seed',
      phone: '+79000000003',
      status: Status.ACTIVE,
      role: Role.ADMIN,
      passwordHash: SEED_PASSWORD_HASH,
    },
    {
      id: seedUuid(10000000, 4),
      surname: 'Белова',
      name: 'Ирина',
      patronymic: 'Сергеевна',
      email: 'admin2@job-journal.seed',
      phone: '+79000000004',
      status: Status.ACTIVE,
      role: Role.ADMIN,
      passwordHash: SEED_PASSWORD_HASH,
    },
    {
      id: seedUuid(10000000, 5),
      surname: 'Громов',
      name: 'Виктор',
      patronymic: null,
      email: 'admin3@job-journal.seed',
      phone: null,
      status: Status.ACTIVE,
      role: Role.ADMIN,
      passwordHash: SEED_PASSWORD_HASH,
    },
  ];

  const statuses: Status[] = [
    Status.ACTIVE,
    Status.ACTIVE,
    Status.ACTIVE,
    Status.ACTIVE,
    Status.ACTIVE,
    Status.ACTIVE,
    Status.ACTIVE,
    Status.PENDING,
    Status.INACTIVE,
    Status.BLOCKED,
  ];

  for (let index = 0; index < 25; index += 1) {
    const sequence = index + 6;
    users.push({
      id: seedUuid(10000000, sequence),
      surname: SURNAMES[index % SURNAMES.length],
      name: FIRST_NAMES[index % FIRST_NAMES.length],
      patronymic: index % 3 === 0 ? PATRONYMICS[index % PATRONYMICS.length] : null,
      email: `user${String(sequence).padStart(2, '0')}@job-journal.seed`,
      phone: index % 4 === 0 ? null : `+7901${String(sequence).padStart(7, '0')}`,
      status: statuses[index % statuses.length],
      role: Role.USER,
      passwordHash: SEED_PASSWORD_HASH,
    });
  }

  return users;
}

export const USERS_SEED = buildUsers();
