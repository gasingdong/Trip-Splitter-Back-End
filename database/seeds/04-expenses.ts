import * as Knex from 'knex';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  return knex('expenses')
    .truncate()
    .then(() => {
      // Inserts seed entries
      return knex('expenses').insert([
        {
          name: 'Uber',
          trip_id: 1,
          person_id: 1,
          amount: 20.3,
        },
        {
          name: 'Room',
          trip_id: 1,
          person_id: 2,
          amount: 100.1,
        },
      ]);
    });
}
