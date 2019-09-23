import { Request, Response, NextFunction } from 'express';
import Trips from './trip-model';
import TripMiddleware from './trip-middleware';
import People from '../people/people-model';
import Restricted from '../restricted-middleware';
import Expenses from '../expenses/expenses-model';

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
  )
  .delete(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const deleted = await Trips.deleteTrip(Number(req.params.id));
        res.status(200).json(deleted);
      } catch (err) {
        next(err);
      }
    }
  );

router.post(
  '/:id/people',
  [TripMiddleware.validateTripId, Restricted.restrictedByTrip],
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

router.post(
  '/:id/expenses',
  [TripMiddleware.validateTripId, Restricted.restrictedByTrip],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const saved = await Expenses.addExpenseToTrip(req.body, id);
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
