import { Request, Response } from 'express';
import TripMiddleware from './trip-middleware';

const router = require('express').Router();

router.get(
  '/:id',
  TripMiddleware.validateTripId,
  (req: Request, res: Response): void => {
    res.status(200).json(req.trip);
  }
);

export default router;
