import { Request, Response, NextFunction } from 'express';
import Codes from '../../config/codes';
import Expenses from './expenses-model';
import Trips from '../trips/trip-model';
import Debts from '../debts/debts-model';
import { Expense, Debt } from '../../types';

declare module 'express-serve-static-core' {
  interface Request {
    expense?: Expense;
    debt?: Debt;
  }
}

// Validate that an expense by this id exists
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
          next();
        } else {
          res.status(404).json(Codes.NOT_FOUND);
        }
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

// Validate that a debt by this id exists
const validateDebtId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id, personId } = req.params;

  // Ensure there's an id
  if (id && personId) {
    try {
      const existingDebt = await Debts.getDebtByPersonAndExpense(
        Number(personId),
        Number(id)
      );
      if (existingDebt) {
        req.debt = existingDebt;
        const existingExpense = await Expenses.getByExpenseId(
          existingDebt.expense_id
        );

        if (existingExpense) {
          // eslint-disable-next-line @typescript-eslint/camelcase
          const { trip_id } = existingExpense;
          const trip = await Trips.getByTripId(trip_id);

          if (trip) {
            req.trip = trip;
            next();
          } else {
            res.status(404).json(Codes.NOT_FOUND);
          }
        } else {
          res.status(404).json(Codes.NOT_FOUND);
        }
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
  validateDebtId,
};
