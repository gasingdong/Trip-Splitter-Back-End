import { Request, Response, NextFunction } from 'express';
import Codes from '../../config/codes';
import Expenses from './expenses-model';
import Trips from '../trips/trip-model';
import { Expense } from '../../types';

declare module 'express-serve-static-core' {
  interface Request {
    expense?: Expense;
  }
}

const validateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  // Ensure there's an id
  if (id) {
    try {
      const existingExpense = await Expenses.getByExpenseId(Number(id));

      if (existingExpense) {
        req.expense = existingExpense;
        const trip = await Trips.getByTripId(existingExpense.trip_id);

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
  validateExpenseId,
};
