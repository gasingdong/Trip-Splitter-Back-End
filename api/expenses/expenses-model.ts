import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Expense } from '../../types';

interface ExpenseInput {
  person_id: number;
  name: string;
  amount: number;
}

interface ExpenseUpdate {
  person_id?: number;
  name?: string;
  amount?: number;
}

const getByExpenseId = (id: number): QueryBuilder<{}, Expense> => {
  return db('expenses')
    .where({ id })
    .first<Expense>();
};

const addExpenseToTrip = (expense: ExpenseInput, id: number): QueryBuilder => {
  return db('expenses').insert(
    {
      trip_id: id,
      person_id: expense.person_id,
      name: expense.name,
      amount: expense.amount,
    },
    'id'
  );
};

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

const updateExpense = (expense: ExpenseUpdate, id: number): QueryBuilder => {
  return db('expenses')
    .where({ id })
    .update(expense, 'id');
};

const deleteExpense = (id: number): QueryBuilder => {
  return db('expenses')
    .where({ id })
    .del('id');
};

export default {
  getByExpenseId,
  getExpensesByTripId,
  addExpenseToTrip,
  updateExpense,
  deleteExpense,
};
