import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const config: TypeOrmModuleOptions = {
  type: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrationsTableName: 'migrations_seed',
  logging: process.env.DB_LOGGING === 'true',
  migrations: ['./dist/database/typeorm/seeds/*.ts'],
  cli: {
    migrationsDir: './src/database/typeorm/seeds',
  },
};

export default config;
