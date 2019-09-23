import { QueryBuilder } from 'knex';
import db from '../../database/db-config';
import Trips from '../trips/trip-model';
import { User } from '../../types';

interface UserInput {
  username: string;
  password: string;
}

const getByUsername = (username: string): Promise<User> => {
  const userQuery = db('users')
    .where({ username })
    .first<User>();
  const tripsQuery = Trips.getTripsByUsername(username);
  return Promise.all([userQuery, tripsQuery]).then(([user, trips]) => {
    return {
      ...user,
      trips,
    };
  });
};

const add = (user: UserInput): QueryBuilder => {
  return db('users').insert(user, 'id');
};

export default {
  getByUsername,
  add,
};
