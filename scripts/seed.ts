import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const passwordHash = await hash('Passw0rd!', 12);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });
  const home = await prisma.page.create({ data: { title: 'Home', sortIndex: 0 } });
  const docs = await prisma.page.create({ data: { title: 'LLMs', sortIndex: 1 } });
  await prisma.page.create({ data: { title: 'Quick Start', parentPageId: docs.id, sortIndex: 0 } });
  console.log('Seeded: admin@example.com / Passw0rd!', { home: home.id, docs: docs.id });
}
main().finally(() => prisma.$disconnect());
