/* eslint-disable no-undef */
import request from 'supertest';
import db from '../../database/db-config';
import server from '../server';
import prepTestDb from '../../helpers/prepTestDb';

// Dummy user for testing purposes
const dummyUser = { username: 'dummyuser', password: 'dummypassword' };

// Initiate the migrations for the testing environment
beforeAll(async () => {
  await prepTestDb();
});

describe('auth-router.js', () => {
  describe('register endpoint', () => {
    it('should add user to database', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(dummyUser);
      expect(res.status).toBe(201);
      const results = await db('users');
      expect(results).toHaveLength(3);
    });

    it('should fail on invalid entry', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'nopassword' });
      expect(res.status).toBe(400);
    });
  });

  describe('login endpoint', () => {
    it('should return JSON', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send(dummyUser);
      expect(res.type).toMatch(/json/i);
    });

    it('should receive a 200 OK on valid login', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send(dummyUser);
      expect(res.status).toBe(200);
    });
  });
});
