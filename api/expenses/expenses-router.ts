import { Request, Response, NextFunction } from 'express';
import Restricted from '../restricted-middleware';
import ExpensesMiddleware from './expenses-middleware';
import Expenses from './expenses-model';
import Debts from '../debts/debts-model';

const router = require('express').Router();

router
  .route('/:id')
  .all([ExpensesMiddleware.validateExpenseId, Restricted.restrictedByTrip])
  /**
   * @api {put} /api/expenses/:id Edit Expense information
   * @apiName EditExpense
   * @apiGroup Expenses
   * @apiPermission Trip Editor
   *
   * @apiParam (params)   {Number}  id           Expense's unique ID.
   * @apiParam (request)  {Number}  [person_id]  ID of the Person who paid for the Expense.
   * @apiParam (request)  {String}  [name]       Name of the Expense.
   * @apiParam (request)  {Number}  [amount]     Amount paid for the Expense.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  name: "Jan",
   *  amount: 50.95
   * }
   *
   * @apiSuccess (200) {Number} num Number of updated records.
   */
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
  /**
   * @api {delete} /api/expenses/:id Delete Expense
   * @apiName DeleteExpense
   * @apiGroup Expenses
   * @apiPermission Trip Editor
   *
   * @apiParam {Number} id Expense's unique ID.
   *
   * @apiSuccess (200) {Number} num Number of deleted records.
   */
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

/**
 * @api {post} /api/expenses/:id/debts Add Debt for the Expense
 * @apiName AddDebt
 * @apiGroup Expenses
 * @apiPermission Trip Editor
 *
 * @apiParam (params)   {Number} id          Expense's unique ID.
 * @apiParam (request)  {Number} person_id   ID of the Person who owes the Debt.
 * @apiParam (request)  {Number} amount      Amount owed for the Debt.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  person_id: 5,
 *  amount: 10.14
 * }
 *
 * @apiSuccess (201) {Number} id ID of the created Debt.
 */
router.post(
  '/:id/debts',
  [ExpensesMiddleware.validateExpenseId, Restricted.restrictedByTrip],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const saved = await Debts.addDebtToExpense(req.body, id);
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  }
);

router
  .route('/:id/debts/:personId')
  .all([ExpensesMiddleware.validateDebtId, Restricted.restrictedByTrip])
  /**
   * @api {put} /api/expenses/:id/debts/:person_id Edit Debt information
   * @apiName EditDebt
   * @apiGroup Debts
   * @apiPermission Trip Editor
   *
   * @apiParam (params)   {Number}  id          Expense's unique ID.
   * @apiParam (params)   {Number}  person_id   Person's unique ID.
   * @apiParam (request)  {Number}  [amount]    Amount owed for the Debt.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  amount: 10.65
   * }
   *
   * @apiSuccess (200) {Number} num Number of updated records.
   */
  .put(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = Number(req.params.id);
        const personId = Number(req.params.personId);
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { amount } = req.body;
        const updated = await Debts.updateDebt({ amount }, id, personId);
        res.status(200).json(updated);
      } catch (err) {
        next(err);
      }
    }
  )
  /**
   * @api {delete} /api/expenses/:id/debts/:person_id Delete Debt
   * @apiName DeleteDebt
   * @apiGroup Debts
   * @apiPermission Trip Editor
   *
   * @apiParam (params)   {Number}  id          Expense's unique ID.
   * @apiParam (params)   {Number}  person_id   Person's unique ID.
   *
   * @apiSuccess (200) {Number} num Number of deleted records.
   */
  .delete(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = Number(req.params.id);
        const personId = Number(req.params.personId);
        const deleted = await Debts.deleteDebt(id, personId);
        res.status(200).json(deleted);
      } catch (err) {
        next(err);
      }
    }
  );

export default router;
