import { Pool } from 'pg';

export const pool = new Pool({
  user: 'arcade_user',
  host: 'localhost',
  database: 'arcade_games',
  password: 'arcade_password',
  port: 5432,
});