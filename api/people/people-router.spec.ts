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

describe('people-router.js', () => {
  describe('edit person', () => {
    it('should edit person', async () => {
      const res = await request(server).get('/api/people/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    it('should fail on invalid entry', async () => {
      const res = await request(server).get('/api/people/999');
      expect(res.status).toBe(404);
    });
  });
});
