import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      password: await hashPassword('password123'),
      email: 'test@example.com',
    },
  });

  console.log('✅ Test user created:', {
    id: testUser.id,
    username: testUser.username,
    email: testUser.email,
  });

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await hashPassword('admin123'),
      email: 'admin@example.com',
    },
  });

  console.log('✅ Admin user created:', {
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
  });

  // Create user for forgot password testing
  const forgotPasswordUser = await prisma.user.upsert({
    where: { email: 'don@vbreview.com' },
    update: {},
    create: {
      username: 'donvbreview',
      password: await hashPassword('password123'),
      email: 'don@vbreview.com',
    },
  });

  console.log('✅ Forgot password test user created:', {
    id: forgotPasswordUser.id,
    username: forgotPasswordUser.username,
    email: forgotPasswordUser.email,
  });

  console.log('🎉 Database seeded successfully!');
  console.log('\n📝 Test credentials:');
  console.log('Username: testuser | Password: password123');
  console.log('Username: admin | Password: admin123');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
