import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import Trips from '../trips/trip-model';
import People from '../people/people-model';
import { User } from '../../types';
import Friends from '../friends/friends-model';

interface UserInput {
  username: string;
  password: string;
}

const getById = (id: number): QueryBuilder<{}, User> => {
  return db('users')
    .where({ id })
    .first<User>();
};

const getByUsername = async (username: string): Promise<User | null> => {
  const user = await db('users')
    .where({ username })
    .first<User>();

  if (!user) {
    return null;
  }
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
  const friends = await Friends.getFriendsByUsername(username);
  return {
    ...user,
    trips,
    friends,
  };
};

const add = (user: UserInput): QueryBuilder => {
  return db('users').insert(user, 'id');
};

export default {
  getById,
  getByUsername,
  add,
};
