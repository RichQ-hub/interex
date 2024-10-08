/**
 * Configures pg pool module to connect to postgresql database.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Automatically connects to the database using the environment variables defined
// in the .env file.
const pool = new Pool({
  // host: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_HOST : process.env.DB_HOST, // "db" is the name of the postgres service in docker-compose.yml. This is because each Docker container has its own definition of localhost. You can think of db as the container's localhost.
  host: 'localhost',
  port: 5432,
  // database: 'postgres',
  database: 'interex',
	user: 'postgres',
  // password: '1234',
  password: 'Okimorov068%'
});

// We are exporting the query function from pg pool.
export default {
	query: (text: string, params?: any[]) => pool.query(text, params),
};

// Link to types: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pg/index.d.ts
