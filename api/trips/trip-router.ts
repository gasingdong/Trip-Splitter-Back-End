import { Request, Response, NextFunction } from 'express';
import Trips from './trip-model';
import TripMiddleware from './trip-middleware';

const router = require('express').Router();

router
  .route('/:id')
  .all(TripMiddleware.validateTripId)
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

export default router;
