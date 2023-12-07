/**
 * Configures pg pool module to connect to postgresql database.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') }) 

// Automatically connects to the database using the environment variables defined
// in the .env file.
const pool = new Pool();

// We are exporting the query function from pg pool.
export default {
	query: (text: string, params?: any[]) => pool.query(text, params),
};

// Wonder if you can just do [export default pool.query;]? TEST THIS

// Link to types: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pg/index.d.ts
