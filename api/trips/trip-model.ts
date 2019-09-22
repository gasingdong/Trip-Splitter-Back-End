import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Trip } from '../../types';

const getByTripId = (id: number): QueryBuilder<{}, Trip> => {
  return db('trips')
    .where({ id })
    .first<Trip>();
};

export default {
  getByTripId,
};
