import dataSource from '../data-source';
import { seedRoles } from './role.seed';
import { seedUsers } from './user.seed';

async function runSeed() {
  console.log('🔌 Connecting to database...');
  await dataSource.initialize();
  console.log('✅ Database connected');

  // ⚠️ Order matters — roles must run before users
  const seeders: Array<{ name: string; fn: () => Promise<void> }> = [
    { name: 'Roles', fn: () => seedRoles(dataSource) },
    { name: 'Users', fn: () => seedUsers(dataSource) },
  ];

  try {
    for (const seeder of seeders) {
      console.log(`\n▶ Running ${seeder.name} seeder...`);
      await seeder.fn();
      console.log(`✔ ${seeder.name} seeder done`);
    }
    console.log('\n🎉 All seeders completed successfully');
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

runSeed().catch(async (error) => {
  console.error('❌ Seed failed:', error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});