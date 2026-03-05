// scripts/create-demo-user.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: 'user-123' }
    });

    if (existingUser) {
      console.log('✅ Demo user already exists');
    } else {
      // Create demo user
      const user = await prisma.user.create({
        data: {
          id: 'user-123',
          name: 'Demo User',
          email: 'demo@bellora.com',
          role: 'USER',
        }
      });
      console.log('✅ Demo user created:', user);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
