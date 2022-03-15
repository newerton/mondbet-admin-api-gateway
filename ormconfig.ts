import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

dotenv.config();

function migrationDirectory() {
  return process.env.NODE_ENV === 'migration' ? 'src' : `dist`;
}

const config: TypeOrmModuleOptions = {
  type: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: process.env.DB_LOGGING === 'true',
  autoLoadEntities: true,
  charset: 'utf8mb4_unicode_ci',
  entities: [`./${migrationDirectory()}/**/*.entity{.ts,.js}`],
  migrations: [
    `./${migrationDirectory()}/database/typeorm/migrations/*{.ts,.js}`,
  ],
  cli: {
    migrationsDir: './src/database/typeorm/migrations',
  },
};

export default config;
