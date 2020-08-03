import * as Knex from 'knex';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  return knex('people')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('people').insert([
        {
          first_name: 'Ryan',
          last_name: 'Williams',
          trip_id: 1,
        },
        {
          first_name: 'Darren',
          last_name: 'Wilson',
          trip_id: 1,
        },
      ]);
    });
}
