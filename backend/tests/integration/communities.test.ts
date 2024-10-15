import type { Server } from 'http';
import { clearDatabase, createTestServer, initialiseDatabase } from '../utils/helpers';
import request from 'supertest';

let server: Server;

beforeAll(async () => {
  server = await createTestServer();
  await initialiseDatabase();
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

  test('Test registering a new user', async () => {
    const username = 'fakeUser';
    const password = 'fakeUserPwd';
    const email = 'fakers@gmail.com';

    // const res = await request(server).post('/api/auth/login').send({ login: username, password });
    try {
      const res = await request(server)
        .post('/api/v1/auth/register')
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
    } catch (error) {
      console.log(error)
    }
  });
});