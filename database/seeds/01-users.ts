import * as Knex from 'knex';
import bcryptjs from 'bcryptjs';
import Secrets from '../config/secrets';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: Secrets.admin,
          password: bcryptjs.hashSync(Secrets.adminPassword),
        },
      ]);
    });
}
