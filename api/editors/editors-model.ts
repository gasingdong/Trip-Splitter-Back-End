/* eslint-disable @typescript-eslint/camelcase */
import { QueryBuilder } from 'knex';
import db from '../../database/db-config';

const getEditorsByTripId = (id: number): QueryBuilder => {
  return db('trip_editors as te')
    .where({ trip_id: id })
    .join('users as u', 'te.user_id', 'u.id')
    .select(['u.id', 'u.username']);
};

const addEditorToTrip = (id: number, tripId: number): QueryBuilder => {
  return db('trip_editors').insert({ user_id: id, trip_id: tripId }, [
    'user_id',
    'trip_id',
  ]);
};

const deleteEditorFromTrip = (id: number, tripId: number): QueryBuilder => {
  return db('trip_editors')
    .where({ user_id: id, trip_id: tripId })
    .del(['user_id', 'trip_id']);
};

export default {
  addEditorToTrip,
  getEditorsByTripId,
  deleteEditorFromTrip,
};
