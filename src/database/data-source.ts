import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as dotenvConfig } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';

const env = process.env.NODE_ENV ?? 'development';
const envFilePath = resolve(process.cwd(), `.env.${env}`);

if (existsSync(envFilePath)) {
  dotenvConfig({ path: envFilePath });
} else {
  dotenvConfig();
}

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
