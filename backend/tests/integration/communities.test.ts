import type { Server } from 'http';
import { clearDatabase, closeServer, createTestServer, initialiseDatabase, truncateDatabase } from '../utils/helpers';
import request from 'supertest';

const BASE_URL = '/api/v1';

let server: Server;

beforeAll(async () => {
  await clearDatabase();
	server = await createTestServer();
	await initialiseDatabase();
});

afterAll(() => {
  closeServer(server);
});

describe('Community Routes', () => {
  afterEach(async () => {
    await truncateDatabase();
  });

  test('Addition works', () => {
    expect(1 + 2).toBe(3);
  });

  test('Test registering a new user', async () => {
    const username = 'fakeUser';
    const password = 'fakeUserPwd';
    const email = 'fakers@gmail.com';

    const res = await request(server)
      .post(`${BASE_URL}/auth/register`)
      .send({
        email,
        username,
        password
      });
    
      expect(res.body).toMatchObject({
        username: 'fakeUser',
      	email: 'fakers@gmail.com',
      })
    
    expect(res.statusCode).toEqual(200);
  });
});