import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import { Person } from '../../types';

interface PersonInput {
  first_name: string;
  last_name?: string;
  user_id?: string;
}

const getByPersonId = (id: number): QueryBuilder<{}, Person> => {
  return db('people')
    .where({ id })
    .first<Person>();
};

const getPeopleByTripId = (id: number): QueryBuilder<{}, Person[]> => {
  return db('people as p')
    .where({ trip_id: id })
    .join('trips as t', 't.id', 'p.trip_id')
    .select(['p.id', 'p.first_name', 'p.last_name', 'p.user_id']);
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

export default {
  getByPersonId,
  getPeopleByTripId,
  addPersonToTrip,
};
