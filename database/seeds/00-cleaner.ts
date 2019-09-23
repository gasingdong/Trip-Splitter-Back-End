import * as Knex from 'knex';
import cleaner from 'knex-cleaner';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<void> {
  return cleaner.clean(knex, {
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'], // don't empty migration tables
  });
}
