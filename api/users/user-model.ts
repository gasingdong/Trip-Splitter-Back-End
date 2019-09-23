import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import Trips from '../trips/trip-model';
import People from '../people/people-model';
import { User } from '../../types';

interface UserInput {
  username: string;
  password: string;
}

const getByUsername = async (username: string): Promise<User> => {
  const user = await db('users')
    .where({ username })
    .first<User>();
  let trips = await Trips.getTripsByUsername(username);
  trips = await Promise.all(
    trips.map(async trip => {
      const people = await People.getPeopleByTripId(trip.id);
      return {
        ...trip,
        num_people: people.length,
      };
    })
  );
  return {
    ...user,
    trips,
  };
};

const add = (user: UserInput): QueryBuilder => {
  return db('users').insert(user, 'id');
};

export default {
  getByUsername,
  add,
};
