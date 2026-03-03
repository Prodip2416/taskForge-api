import dataSource from '../data-source';
import { seedUsers } from './user.seed';

async function runSeed() {
  await dataSource.initialize();

  try {
    const seeders: Array<() => Promise<void>> = [() => seedUsers(dataSource)];
    for (const seed of seeders) {
      await seed();
    }
  } finally {
    await dataSource.destroy();
  }
}

runSeed().catch(async (error) => {
  console.error('Seed failed:', error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});
