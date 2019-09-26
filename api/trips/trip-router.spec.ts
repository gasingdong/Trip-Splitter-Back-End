/* eslint-disable no-undef */
import request from 'supertest';
import server from '../server';
import Testing from '../../config/testing';
import prepTestDb from '../../helpers/prepTestDb';

let token = '';

// Initiate the migrations for the testing environment
beforeAll(async () => {
  await prepTestDb();
  token = (await request(server)
    .post('/api/auth/login')
    .send({
      username: Testing.TEST_USER,
      password: Testing.TEST_PASS,
    })).body.token;
});

describe('trip-router.js', () => {
  describe('get trip by id endpoint', () => {
    it('should refuse if not authorized', async () => {
      const res = await request(server).get('/api/trips/1');
      expect(res.status).toBe(401);
    });

    it('should get right trip from database', async () => {
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
      const res = await request(server)
        .put('/api/trips/1')
        .set('Authorization', token)
        .send(testBody);
      expect(res.status).toBe(200);
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

  describe('add editor to trip', () => {
    it('should refuse if not authorized', async () => {
      const res = await request(server)
        .post('/api/trips/1/editors')
        .send({});
      expect(res.status).toBe(401);
    });

    it('should add editor to trip', async () => {
      const addEditor = await request(server)
        .post('/api/trips/1/editors')
        .set('Authorization', token)
        .send({ user_id: 2 });
      expect(addEditor.status).toBe(201);

      const getEditor = await request(server)
        .get('/api/trips/1')
        .set('Authorization', token);
      expect(getEditor.status).toBe(200);
      expect(getEditor.body.editors).toHaveLength(1);
    });
  });

  describe('delete editor', () => {
    it('should fail on invalid entry', async () => {
      const res = await request(server).del('/api/trips/1/editors/2');
      expect(res.status).toBe(401);
    });

    it('should delete debts', async () => {
      const res = await request(server)
        .del('/api/trips/1/editors/2')
        .set('Authorization', token);
      expect(res.status).toBe(200);

      const getEditor = await request(server)
        .get('/api/trips/1')
        .set('Authorization', token);
      expect(getEditor.status).toBe(200);
      expect(getEditor.body.editors).toHaveLength(0);
    });
  });

  describe('delete trip', () => {
    it('should refuse if not authorized', async () => {
      const res = await request(server).del('/api/trips/1');
      expect(res.status).toBe(401);
    });

    it('should delete trip', async () => {
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
