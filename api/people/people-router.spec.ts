/* eslint-disable no-undef */
import request from 'supertest';
import db from '../../database/db-config';
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

describe('people-router.js', () => {
  describe('edit person', () => {
    it('should fail on invalid entry', async () => {
      const res = await request(server)
        .post('/api/people/1')
        .send({});
      expect(res.status).toBe(401);
    });

    it('should edit person', async () => {
      const res = await request(server)
        .put('/api/people/1')
        .set('Authorization', token)
        .send({ first_name: 'David' });
      expect(res.status).toBe(200);

      const person = await db('people')
        .where({ id: 1 })
        .first();
      expect(person).toEqual({
        id: 1,
        trip_id: 1,
        user_id: null,
        first_name: 'David',
        last_name: 'Dong',
      });
    });
  });

  describe('delete person', () => {
    it('should fail on invalid entry', async () => {
      const res = await request(server).del('/api/people/1');
      expect(res.status).toBe(401);
    });

    it('should delete person', async () => {
      const res = await request(server)
        .del('/api/people/1')
        .set('Authorization', token);
      expect(res.status).toBe(200);

      const person = await db('people')
        .where({ id: 1 })
        .first();
      expect(person).toBeUndefined();
    });
  });
});
