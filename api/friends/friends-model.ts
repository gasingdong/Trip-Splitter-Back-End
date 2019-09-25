/* eslint-disable @typescript-eslint/camelcase */
import { QueryBuilder } from 'knex';
import db from '../../database/db-config';

const addFriendToUser = (id: number, friendId: number): QueryBuilder => {
  return db('friends').insert({ user_id: id, friend_id: friendId });
};

const getFriendsByUsername = (username: string): QueryBuilder => {
  return db('friends as f')
    .where('u.username', username)
    .join('users as u', 'u.id', 'f.user_id')
    .join('users as uu', 'uu.id', 'f.friend_id')
    .select(['f.friend_id as id', 'uu.username']);
};

const deleteFriend = (id: number, friendId: number): QueryBuilder => {
  return db('friends')
    .where({ user_id: id, friend_id: friendId })
    .del();
};

export default {
  addFriendToUser,
  getFriendsByUsername,
  deleteFriend,
};
