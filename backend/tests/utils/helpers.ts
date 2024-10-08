import { createServer } from 'http';
import fs from 'fs';

export const createTestServer = async (port: number = 7777) => {
  const server = createServer();
  return server.listen(port);
}

export const clearDatabase = async () => {
  const cleanupScript = fs.readFileSync('../../src/db/cleanup.sql');
  
}