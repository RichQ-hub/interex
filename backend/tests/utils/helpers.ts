import createServer from '../../src/config/server';
import fs from 'fs';
import db, { pool } from '../../src/db';
import type { Server } from 'http';

export const createTestServer = async (port: number = 7777) => {
  const server = createServer();
  return server.listen();
}

export const initialiseDatabase = async () => {
  const script = fs.readFileSync(__dirname + '/../../src/db/schema.sql').toString();
  await db.query(script);
}

export const clearDatabase = async () => {
  const script = fs.readFileSync(__dirname + '/../../src/db/cleanup.sql').toString();
  await db.query(script);
}

export const truncateDatabase = async () => {
  const script = fs.readFileSync(__dirname + '/../../src/db/cleartables.sql').toString();
  await db.query(script);
}

export const closeServer = (server: Server) => {
	server.close();
	// Close pg pool.
	pool.end();
}
