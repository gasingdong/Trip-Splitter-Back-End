import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { User, Trip } from '../../types';

interface UserInput {
  username: string;
  password: string;
}
interface TripInput {
  user_id: number;
  destination?: string;
  date?: Date;
  active?: boolean;
}

const getByUsername = (username: string): QueryBuilder<{}, User> => {
  return db('users')
    .where({ username })
    .first<User>();
};

const getTripsByUsername = (username: string): QueryBuilder<{}, Trip[]> => {
  return db('trips as t')
    .where({ username })
    .join('users as u', 'u.id', 't.user_id')
    .select(['t.id', 't.destination', 't.date', 't.active']);
};

const add = (user: UserInput): QueryBuilder => {
  return db('users').insert(user, 'id');
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

export default {
  getByUsername,
  getTripsByUsername,
  add,
  addTripForUserId,
};
