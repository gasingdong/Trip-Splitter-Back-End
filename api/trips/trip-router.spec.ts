/* eslint-disable no-undef */
import request from 'supertest';
import db from '../../database/db-config';
import server from '../server';
import Testing from '../../config/testing';

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
    const testBody = {
      destination: 'something',
      date: '09-14-2019',
    };

    it('should refuse if not authorized', async () => {
      const res = await request(server)
        .put('/api/trips/1')
        .send(testBody);
      expect(res.status).toBe(401);
    });

    it('should update trip', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;
      const res = await request(server)
        .put('/api/trips/1')
        .set('Authorization', token)
        .send(testBody);
      expect(res.status).toBe(200);

      const trip = await request(server).get('/api/trips/1');
      expect(trip.body).toEqual({
        id: 1,
        created_by: 'test',
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

  describe('add person to trip', () => {
    const testUser = { first_name: 'Barry' };

    it('should refuse if not authorized', async () => {
      const res = await request(server)
        .post('/api/trips/1/people')
        .send(testUser);
      expect(res.status).toBe(401);
    });

    it('should add trip to user', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;

      const addPerson = await request(server)
        .post('/api/trips/1/people')
        .set('Authorization', token)
        .send(testUser);
      expect(addPerson.status).toBe(201);

      const getPeople = await request(server).get('/api/trips/1/people');
      expect(getPeople.status).toBe(200);
      expect(getPeople.body).toHaveLength(3);
    });
  });
});
