import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('debt', debt => {
    debt
      .integer('expense_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('expenses')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    debt
      .integer('person_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('people')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    debt.decimal('amount', null, 2).notNullable();

    debt.primary(['expense_id', 'person_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('debt');
}
