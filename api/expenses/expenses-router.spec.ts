/* eslint-disable no-undef */
import request from 'supertest';
import db from '../../database/db-config';
import server from '../server';
import Testing from '../../config/testing';
import Expenses from './expenses-model';
import Debts from '../debts/debts-model';

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

describe('expenses-router.js - debts', () => {
  describe('edit debts', () => {
    it('should fail on invalid entry', async () => {
      const res = await request(server)
        .post('/api/expenses/1/debts/2')
        .send({});
      expect(res.status).toBe(401);
    });

    it('should edit debts', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;
      const res = await request(server)
        .put('/api/expenses/1/debts/2')
        .set('Authorization', token)
        .send({ amount: 999.12 });
      expect(res.status).toBe(200);

      const debt = await Debts.getDebtByPersonAndExpense(2, 1);
      expect(debt).toEqual({
        expense_id: 1,
        person_id: 2,
        amount: 999.12,
      });
    });
  });

  describe('delete debt', () => {
    it('should fail on invalid entry', async () => {
      const res = await request(server).del('/api/expenses/1/debts/2');
      expect(res.status).toBe(401);
    });

    it('should delete debts', async () => {
      const { token } = (await request(server)
        .post('/api/auth/login')
        .send({
          username: Testing.TEST_USER,
          password: Testing.TEST_PASS,
        })).body;
      const res = await request(server)
        .del('/api/expenses/1/debts/2')
        .set('Authorization', token);
      expect(res.status).toBe(200);

      const expense = await Debts.getDebtByPersonAndExpense(2, 1);
      expect(expense).toBeUndefined();
    });
  });
});
