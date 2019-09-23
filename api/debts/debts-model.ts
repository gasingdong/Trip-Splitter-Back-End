/* eslint-disable @typescript-eslint/camelcase */
import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Debt } from '../../types';

interface DebtInput {
  person_id: number;
  amount: number;
}
interface DebtUpdate {
  amount?: number;
}

const getDebtByPersonAndExpense = (
  person_id: number,
  expense_id: number
): QueryBuilder<{}, Debt> => {
  return db('debt')
    .where({ person_id, expense_id })
    .first<Debt>();
};

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

const addDebtToExpense = (debt: DebtInput, id: number): QueryBuilder => {
  return db('debt').insert({ ...debt, expense_id: id }, [
    'expense_id',
    'person_id',
  ]);
};

const updateDebt = (
  debt: DebtUpdate,
  expense_id: number,
  person_id: number
): QueryBuilder => {
  return db('debt')
    .where({ expense_id, person_id })
    .update(debt, 'id');
};

const deleteDebt = (expense_id: number, person_id: number): QueryBuilder => {
  return db('debt')
    .where({ expense_id, person_id })
    .del(['expense_id', 'person_id']);
};

export default {
  getDebtByPersonAndExpense,
  getDebtsByExpenseId,
  addDebtToExpense,
  updateDebt,
  deleteDebt,
};
