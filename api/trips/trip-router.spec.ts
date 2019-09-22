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
      expect(res.body.id).toBe(1);
    });

    it('should fail on invalid entry', async () => {
      const res = await request(server).get('/api/trips/999');
      expect(res.status).toBe(404);
    });
  });

  describe('change trip', () => {
    it('should update database', async () => {
      const testBody = {
        destination: 'something',
        date: '09-14-2019',
      };
      const res = await request(server)
        .put('/api/trips/1')
        .send(testBody);
      expect(res.status).toBe(200);

      const trip = await request(server).get('/api/trips/1');
      expect(trip.body).toEqual({
        id: 1,
        user_id: 1,
        active: true,
        ...testBody,
      });
    });
  });

  describe('get people on trip', () => {
    it('should retrieve list of people', async () => {
      const res = await request(server).get('/api/trips/1/people');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should fail on invalid entry', async () => {
      const res = await request(server).get('/api/trips/999/people');
      expect(res.status).toBe(404);
    });
  });
});
