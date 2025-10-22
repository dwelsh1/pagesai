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

  // Create test pages
  const testPage1 = await prisma.page.upsert({
    where: { id: 'test-page-1' },
    update: {},
    create: {
      id: 'test-page-1',
      title: 'Welcome to PagesAI',
      content: JSON.stringify([
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Welcome to PagesAI! This is your first page. You can edit this content using the rich text editor.',
            },
          ],
        },
        {
          type: 'heading',
          props: { level: 2 },
          content: [
            {
              type: 'text',
              text: 'Getting Started',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Here are some things you can do:',
            },
          ],
        },
        {
          type: 'bulletListItem',
          content: [
            {
              type: 'text',
              text: 'Create new pages',
            },
          ],
        },
        {
          type: 'bulletListItem',
          content: [
            {
              type: 'text',
              text: 'Edit existing pages',
            },
          ],
        },
        {
          type: 'bulletListItem',
          content: [
            {
              type: 'text',
              text: 'Organize pages hierarchically',
            },
          ],
        },
      ]),
      description: 'Your first page in PagesAI',
      tags: 'welcome,getting-started',
      userId: testUser.id,
    },
  });

  const testPage2 = await prisma.page.upsert({
    where: { id: 'test-page-2' },
    update: {},
    create: {
      id: 'test-page-2',
      title: 'Sample Document',
      content: JSON.stringify([
        {
          type: 'heading',
          props: { level: 1 },
          content: [
            {
              type: 'text',
              text: 'Sample Document',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a sample document to demonstrate the rich text editor capabilities.',
            },
          ],
        },
        {
          type: 'heading',
          props: { level: 2 },
          content: [
            {
              type: 'text',
              text: 'Features',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The editor supports various formatting options including:',
            },
          ],
        },
        {
          type: 'bulletListItem',
          content: [
            {
              type: 'text',
              text: 'Bold and italic text',
            },
          ],
        },
        {
          type: 'bulletListItem',
          content: [
            {
              type: 'text',
              text: 'Headings and subheadings',
            },
          ],
        },
        {
          type: 'bulletListItem',
          content: [
            {
              type: 'text',
              text: 'Lists and bullet points',
            },
          ],
        },
      ]),
      description: 'A sample document showcasing editor features',
      tags: 'sample,document,features',
      userId: testUser.id,
    },
  });

  console.log('✅ Test pages created:', {
    page1: testPage1.title,
    page2: testPage2.title,
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
