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
  // host: process.env.DB_HOST, // This refers to the name of the service container name defined in the docker-compose file.
  // port: Number(process.env.DB_PORT),
  // database: process.env.DB_NAME,
	// user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  host: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_HOST : process.env.DB_HOST, // This refers to the name of the service container name defined in the docker-compose file.
  port: process.env.NODE_ENV === 'test' ? Number(process.env.TEST_DB_PORT) : Number(process.env.DB_PORT),
  database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
	user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// We are exporting the query function from pg pool.
export default {
	query: (text: string, params?: any[]) => pool.query(text, params),
};

// Link to types: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pg/index.d.ts
