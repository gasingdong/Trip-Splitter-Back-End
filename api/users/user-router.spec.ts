/* eslint-disable no-undef */
import request from 'supertest';
import db from '../../database/db-config';
import server from '../server';
import Secrets from '../../config/secrets';

// Initiate the migrations for the testing environment
beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

describe('user-router.js', () => {
  describe('get user by id endpoint', () => {
    it('should get right user from database', async () => {
      const res = await request(server).get('/api/users/admin');
      expect(res.status).toBe(200);
      expect(res.body.username).toEqual(Secrets.admin);
    });

    it('should fail on invalid entry', async () => {
      const res = await request(server).get('/api/users/bongo');
      expect(res.status).toBe(404);
    });
  });
});
