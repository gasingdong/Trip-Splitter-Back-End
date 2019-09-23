import { Request, Response, NextFunction } from 'express';
import Restricted from '../restricted-middleware';
import ExpensesMiddleware from './expenses-middleware';
import Expenses from './expenses-model';

const router = require('express').Router();

router
  .route('/:id')
  .all([ExpensesMiddleware.validateExpenseId, Restricted.restrictedByTrip])
  .put(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = Number(req.params.id);
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { person_id, name, amount } = req.body;
        const updated = await Expenses.updateExpense(
          { person_id, name, amount },
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
        const deleted = await Expenses.deleteExpense(Number(req.params.id));
        res.status(200).json(deleted);
      } catch (err) {
        next(err);
      }
    }
  );

export default router;
