import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { User } from '../app/entities/user.entity';

// Standalone TypeORM DataSource for CLI usage (migrations, etc.)
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'cornerstone',
  entities: [User],
  migrations: [join(__dirname, '..', 'migrations', '*.ts')],
  synchronize: false,
  logging: false,
});

export default AppDataSource;
