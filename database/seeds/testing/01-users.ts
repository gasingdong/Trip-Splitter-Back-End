import * as Knex from 'knex';
import bcryptjs from 'bcryptjs';
import Testing from '../../../config/testing';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: Testing.TEST_USER,
          password: bcryptjs.hashSync(Testing.TEST_PASS),
        },
      ]);
    });
}
