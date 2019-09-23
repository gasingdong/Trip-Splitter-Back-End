import { Request, Response, NextFunction } from 'express';
import Trips from './trip-model';
import TripMiddleware from './trip-middleware';
import People from '../people/people-model';
import Restricted from '../restricted-middleware';

const router = require('express').Router();

router
  .route('/:id')
  .all([TripMiddleware.validateTripId, Restricted.restrictedByTrip])
  .get((req: Request, res: Response): void => {
    res.status(200).json(req.trip);
  })
  .put(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = Number(req.params.id);
        const { destination, date, active } = req.body;
        const updated = await Trips.updateTrip(
          { destination, date, active },
          id
        );
        res.status(200).json(updated);
      } catch (err) {
        next(err);
      }
    }
  );

router
  .route('/:id/people')
  .all([TripMiddleware.validateTripId, Restricted.restrictedByTrip])
  .get(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = Number(req.params.id);
        const people = await People.getPeopleByTripId(id);
        res.status(200).json(people);
      } catch (err) {
        next(err);
      }
    }
  )
  .post(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = Number(req.params.id);
        const saved = await People.addPersonToTrip(req.body, id);
        res.status(201).json(saved);
      } catch (err) {
        next(err);
      }
    }
  );

export default router;
