/* eslint-disable no-undef */
import request from 'supertest';
import db from '../../database/db-config';
import server from '../server';

// Dummy user for testing purposes
const testUser = { username: 'test', password: 'test' };

// Initiate the migrations for the testing environment
beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

describe('auth-router.js', () => {
  describe('register endpoint', () => {
    it('should add user to database', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(testUser);
      expect(res.status).toBe(201);
      const results = await db('users');
      expect(results).toHaveLength(2);
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
        .send(testUser);
      expect(res.type).toMatch(/json/i);
    });

    it('should receive a 200 OK on valid login', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send(testUser);
      expect(res.status).toBe(200);
    });
  });
});
