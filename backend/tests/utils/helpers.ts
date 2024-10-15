import createServer from '../../src/config/server';
import fs from 'fs';
import db from '../../src/db';

export const createTestServer = async (port: number = 7777) => {
  const server = createServer();
  return server.listen(port);
}

export const clearDatabase = async () => {
  const cleanupScript = fs.readFileSync(__dirname + '/../../src/db/cleartables.sql').toString();
  await db.query(cleanupScript);
}

