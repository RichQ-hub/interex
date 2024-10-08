import type { Server } from 'http';
import { clearDatabase, createTestServer } from '../utils/helpers';

let server: Server;

beforeAll(async () => {
  server = await createTestServer();
});

afterAll(() => {
  server.close();
});

describe('Community Routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  test('Addition works', () => {
    expect(1 + 2).toBe(3);
  });


});