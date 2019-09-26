import * as Knex from 'knex';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  return knex('debt')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('debt').insert([
        {
          expense_id: 1,
          person_id: 2,
          amount: 9.64,
        },
        {
          expense_id: 2,
          person_id: 1,
          amount: 77.12,
        },
      ]);
    });
}
