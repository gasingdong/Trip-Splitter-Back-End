/* eslint-disable no-undef */
import request from 'supertest';
import db from '../../database/db-config';
import server from '../server';
import Testing from '../../config/testing';
import Expenses from './expenses-model';

// Initiate the migrations for the testing environment
beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

describe('expenses-router.js', () => {
  describe('edit expense', () => {
    it('should fail on invalid entry', async () => {
      const res = await request(server)
        .post('/api/expenses/1')
        .send({});
      expect(res.status).toBe(401);
    });

    it('should edit expense', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;
      const res = await request(server)
        .put('/api/expenses/1')
        .set('Authorization', token)
        .send({ name: 'Editing Works' });
      expect(res.status).toBe(200);

      const expense = await Expenses.getByExpenseId(1);
      expect(expense).toEqual({
        id: 1,
        name: 'Editing Works',
        person_id: 1,
        trip_id: 1,
        amount: 20.3,
      });
    });
  });

  describe('delete expense', () => {
    it('should fail on invalid entry', async () => {
      const res = await request(server).del('/api/expenses/1');
      expect(res.status).toBe(401);
    });

    it('should delete expense', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;
      const res = await request(server)
        .del('/api/expenses/1')
        .set('Authorization', token);
      expect(res.status).toBe(200);

      const expense = await Expenses.getByExpenseId(1);
      expect(expense).toBeUndefined();
    });
  });
});
