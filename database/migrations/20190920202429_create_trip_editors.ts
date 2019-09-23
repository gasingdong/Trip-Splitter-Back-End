import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('trip_editors', editors => {
    editors
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    editors
      .integer('trip_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('trips')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    editors.primary(['user_id', 'trip_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('trip_editors');
}
