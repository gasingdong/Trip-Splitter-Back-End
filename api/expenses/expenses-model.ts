import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Expense } from '../../types';

const getExpensesByTripId = (id: number): QueryBuilder<{}, Expense[]> => {
  return db('expenses as e')
    .where('e.trip_id', id)
    .join('trips as t', 't.id', 'e.trip_id')
    .join('people as p', 'p.id', 'e.person_id')
    .select([
      'e.id',
      'e.name',
      'e.person_id',
      'e.amount',
      'p.first_name',
      'p.last_name',
    ]);
};

export default {
  getExpensesByTripId,
};
