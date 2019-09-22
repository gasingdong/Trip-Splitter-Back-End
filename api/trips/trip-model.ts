import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Trip } from '../../types';

interface TripUpdate {
  destination?: string;
  date?: Date;
  active?: boolean;
}

const getByTripId = (id: number): QueryBuilder<{}, Trip> => {
  return db('trips')
    .where({ id })
    .first<Trip>();
};

const updateTrip = (trip: TripUpdate, id: number): QueryBuilder<{}, Trip> => {
  return db('trips')
    .where({ id })
    .update(trip, 'id');
};

export default {
  getByTripId,
  updateTrip,
};
