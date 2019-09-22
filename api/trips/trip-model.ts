import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Trip, Person } from '../../types';

interface TripUpdate {
  destination?: string;
  date?: Date;
  active?: boolean;
}

interface PersonInput {
  first_name: string;
  last_name?: string;
  user_id?: string;
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

const getPeopleByTripId = (id: number): QueryBuilder<{}, Person[]> => {
  return db('people as p')
    .where({ trip_id: id })
    .join('trips as t', 't.id', 'p.trip_id')
    .select(['p.id', 'p.first_name', 'p.last_name']);
};

const addPersonToTrip = (person: PersonInput, id: number): QueryBuilder => {
  return db('people').insert(
    {
      trip_id: id,
      first_name: person.first_name,
      last_name: person.last_name,
      user_id: person.user_id,
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
  getPeopleByTripId,
  addPersonToTrip,
  updateTrip,
};
