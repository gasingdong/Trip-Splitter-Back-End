import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Person } from '../../types';

const getByPersonId = (id: number): QueryBuilder<{}, Person> => {
  return db('people')
    .where({ id })
    .first<Person>();
};

export default {
  getByPersonId,
};
