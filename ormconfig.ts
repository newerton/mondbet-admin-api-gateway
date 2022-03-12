import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

dotenv.config();

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
  entities: ['./dist/**/*.entity{.ts,.js}'],
  migrations: ['./src/database/typeorm/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: './src/database/typeorm/migrations',
  },
};

export default config;
