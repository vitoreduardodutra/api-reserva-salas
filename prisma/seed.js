require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

async function main() {
  const name = process.env.ADMIN_NAME || 'Administrador';
  const email = (process.env.ADMIN_EMAIL || 'admin@salas.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { name, role: 'ADMIN' },
    create: { name, email, passwordHash, role: 'ADMIN' }
  });

  const roomCount = await prisma.room.count();
  if (roomCount === 0) {
    await prisma.room.createMany({
      data: [
        { name: 'Sala 01', capacity: 20, location: 'Bloco A' },
        { name: 'Laboratório 01', capacity: 30, location: 'Bloco B' }
      ]
    });
  }

  console.log(`Administrador inicial configurado: ${email}`);
  console.log('Salas de exemplo verificadas.');
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
