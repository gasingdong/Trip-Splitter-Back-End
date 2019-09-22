import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Trip, Person } from '../../types';

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

const getPeopleByTripId = (id: number): QueryBuilder<{}, Person[]> => {
  return db('people as p')
    .where({ trip_id: id })
    .join('trips as t', 't.id', 'p.trip_id')
    .select(['p.id', 'p.first_name', 'p.last_name']);
};

const updateTrip = (trip: TripUpdate, id: number): QueryBuilder<{}, Trip> => {
  return db('trips')
    .where({ id })
    .update(trip, 'id');
};

export default {
  getByTripId,
  getPeopleByTripId,
  updateTrip,
};
