import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { JOB_VARIANTS_SEED } from '../seeds/job-variants.seed';
import { JOURNALS_SEED } from '../seeds/journals.seed';
import { UNITS_SEED } from '../seeds/units.seed';
import { USERS_SEED } from '../seeds/users.seed';

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL'],
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedUsers();
  await seedUnits();
  await seedJobVariants();
  await seedJournals();
}

async function seedUsers() {
  for (const user of USERS_SEED) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        surname: user.surname,
        name: user.name,
        patronymic: user.patronymic,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        passwordHash: user.passwordHash,
      },
      create: user,
    });
  }

  console.log(`Seeded ${USERS_SEED.length} users`);
}

async function seedUnits() {
  for (const unit of UNITS_SEED) {
    await prisma.unit.upsert({
      where: { id: unit.id },
      update: { name: unit.name },
      create: unit,
    });
  }

  console.log(`Seeded ${UNITS_SEED.length} units`);
}

async function seedJobVariants() {
  for (const jobVariant of JOB_VARIANTS_SEED) {
    await prisma.jobVariant.upsert({
      where: { id: jobVariant.id },
      update: { name: jobVariant.name },
      create: jobVariant,
    });
  }

  console.log(`Seeded ${JOB_VARIANTS_SEED.length} job variants`);
}

async function seedJournals() {
  for (const journal of JOURNALS_SEED) {
    await prisma.journal.upsert({
      where: { id: journal.id },
      update: {
        jobVariantId: journal.jobVariantId,
        unitId: journal.unitId,
        amount: journal.amount,
        endDate: journal.endDate,
      },
      create: journal,
    });
  }

  console.log(`Seeded ${JOURNALS_SEED.length} journals`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
