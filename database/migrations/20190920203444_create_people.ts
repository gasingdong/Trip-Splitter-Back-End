import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('people', people => {
    people.increments();

    people.string('first_name', 255).notNullable();

    people.string('last_name', 255);

    people
      .integer('trip_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('trips')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    people
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('people');
}
