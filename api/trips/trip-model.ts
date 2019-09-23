import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Trip } from '../../types';

interface TripInput {
  user_id: number;
  destination?: string;
  date?: Date;
  active?: boolean;
}
interface TripUpdate {
  destination?: string;
  date?: Date;
  active?: boolean;
}

const getByTripId = (id: number): QueryBuilder<{}, Trip> => {
  return db('trips as t')
    .join('users as u', 'u.id', 't.user_id')
    .select([
      't.id',
      't.destination',
      't.date',
      't.active',
      'u.username as created_by',
    ])
    .where('t.id', id)
    .first<Trip>();
};

const getTripsByUsername = (username: string): Promise<Trip[]> => {
  return db('trips as t')
    .where({ username })
    .join('users as u', 'u.id', 't.user_id')
    .select(['t.id', 't.destination', 't.date', 't.active'])
    .then(trips => {
      return trips.map(trip => ({
        ...trip,
        active: Boolean(trip.active),
      }));
    });
};

const addTripForUserId = (trip: TripInput, id: number): QueryBuilder => {
  return db('trips').insert(
    {
      user_id: id,
      destination: trip.destination || null,
      date: trip.date || null,
      active: trip.active || true,
    },
    'id'
  );
};

const updateTrip = (trip: TripUpdate, id: number): QueryBuilder<{}, Trip> => {
  return db('trips')
    .where({ id })
    .update(trip, 'id');
};

export default {
  getByTripId,
  getTripsByUsername,
  addTripForUserId,
  updateTrip,
};
