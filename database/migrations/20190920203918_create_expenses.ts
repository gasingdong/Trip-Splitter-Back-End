import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('expenses', expenses => {
    expenses.increments();

    expenses.string('name', 255).notNullable();

    expenses.decimal('amount', null, 2).notNullable();

    expenses
      .integer('trip_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('trips')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    expenses
      .integer('person_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('people')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('expenses');
}
