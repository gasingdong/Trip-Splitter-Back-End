/* eslint-disable no-undef */
import request from 'supertest';
import db from '../../database/db-config';
import server from '../server';

// Initiate the migrations for the testing environment
beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

describe('trip-router.js', () => {
  describe('get trip by id endpoint', () => {
    it('should get right trip from database', async () => {
      const res = await request(server).get('/api/trips/1');
      expect(res.status).toBe(200);
      console.log(res.body);
      expect(res.body.id).toBe(1);
    });

    it('should fail on invalid entry', async () => {
      const res = await request(server).get('/api/trips/999');
      expect(res.status).toBe(404);
    });
  });
});
