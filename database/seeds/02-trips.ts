import * as Knex from 'knex';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  return knex('trips')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('trips').insert([
        {
          user_id: 1,
          destination: 'Paris',
          active: true,
        },
      ]);
    });
}
