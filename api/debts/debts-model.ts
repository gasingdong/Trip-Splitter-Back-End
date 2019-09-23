import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Debt } from '../../types';

const getDebtsByExpenseId = (id: number): QueryBuilder<{}, Debt[]> => {
  return db('debt as d')
    .where('d.expense_id', id)
    .join('expenses as e', 'e.id', 'd.expense_id')
    .join('people as p', 'p.id', 'd.person_id')
    .select([
      'd.expense_id',
      'd.person_id',
      'p.first_name',
      'p.last_name',
      'd.amount',
    ]);
};

export default {
  getDebtsByExpenseId,
};
