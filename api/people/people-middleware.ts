import { Request, Response, NextFunction } from 'express';
import Codes from '../../config/codes';
import People from './people-model';
import Trips from '../trips/trip-model';
import { Person } from '../../types';

declare module 'express-serve-static-core' {
  interface Request {
    person?: Person;
  }
}

// Validate that a person by this id exists
const validatePersonId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  // Ensure there's an id
  if (id) {
    try {
      const existingPerson = await People.getByPersonId(Number(id));

      if (existingPerson) {
        req.person = existingPerson;
        const trip = await Trips.getByTripId(existingPerson.trip_id);

        if (trip) {
          req.trip = trip;
        }
        next();
      } else {
        res.status(404).json(Codes.NOT_FOUND);
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json(Codes.BAD_REQUEST);
  }
};

export default {
  validatePersonId,
};
