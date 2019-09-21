import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Trip } from '../../types';

interface TripInput {
  user_id: number;
  destination?: string;
  date?: Date;
  active?: boolean;
}

const getByTripId = (id: number): QueryBuilder<{}, Trip> => {
  return db('trips')
    .where({ id })
    .first<Trip>();
};

const add = (trip: TripInput): QueryBuilder => {
  return db('trips').insert(
    {
      user_id: trip.user_id,
      destination: trip.destination || null,
      date: trip.date || null,
      active: trip.active || true,
    },
    'id'
  );
};

export default {
  getByTripId,
  add,
};
