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
    it('should refuse if not authorized', async () => {
      const res = await request(server).get('/api/trips/1');
      expect(res.status).toBe(401);
    });

    it('should get right trip from database', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;
      const res = await request(server)
        .get('/api/trips/1')
        .set('Authorization', token);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
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

      const trip = await request(server)
        .get('/api/trips/1')
        .set('Authorization', token);
      expect(trip.status).toBe(200);
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

    it('should add person to trip', async () => {
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

      const getPeople = await request(server)
        .get('/api/trips/1')
        .set('Authorization', token);
      expect(getPeople.status).toBe(200);
      expect(getPeople.body.people).toHaveLength(3);
    });
  });

  describe('add expense to trip', () => {
    it('should refuse if not authorized', async () => {
      const res = await request(server)
        .post('/api/trips/1/people')
        .send({});
      expect(res.status).toBe(401);
    });

    it('should add expense to trip', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;

      const addExpense = await request(server)
        .post('/api/trips/1/expenses')
        .set('Authorization', token)
        .send({ name: 'Bob Law Blog', amount: 42.21, person_id: 1 });
      expect(addExpense.status).toBe(201);

      const getExpense = await request(server)
        .get('/api/trips/1')
        .set('Authorization', token);
      expect(getExpense.status).toBe(200);
      expect(getExpense.body.expenses).toHaveLength(3);
    });
  });

  describe('delete trip', () => {
    it('should refuse if not authorized', async () => {
      const res = await request(server).del('/api/trips/1');
      expect(res.status).toBe(401);
    });

    it('should delete trip', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;

      const deleted = await request(server)
        .del('/api/trips/1')
        .set('Authorization', token);
      expect(deleted.status).toBe(200);

      const trip = await request(server)
        .get('/api/trips/1')
        .set('Authorization', token);
      expect(trip.status).toBe(404);
    });
  });
});
