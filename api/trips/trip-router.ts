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
  /**
   * @api {get} /api/trips/:id Request Trip information
   * @apiName GetTrip
   * @apiGroup Trip
   * @apiPermission Trip Editor
   *
   * @apiParam {Number} id Trip's unique ID.
   *
   * @apiSuccess {Number}   id                          ID of the Trip.
   * @apiSuccess {String}   destination                 Destination or name of the Trip.
   * @apiSuccess {Date}     date                        Date of the Trip.
   * @apiSuccess {Boolean}  active                      Whether the Trip is active or not.
   * @apiSuccess {Object[]} people                      List of People on the Trip.
   * @apiSuccess {Number}   people.id                   ID of the Person.
   * @apiSuccess {String}   people.first_name           First name of the Person.
   * @apiSuccess {String}   people.last_name            Last name of the Person.
   * @apiSuccess {Number}   people.user_id              The ID of the User associated with the Person.
   * @apiSuccess {Object[]} expenses                    List of Expenses on the Trip.
   * @apiSuccess {Number}   expenses.id                 ID of the Expense.
   * @apiSuccess {String}   expenses.name               Name or description of the Expense.
   * @apiSuccess {Number}   expenses.amount             Amount paid for the Expense.
   * @apiSuccess {Number}   expenses.person_id          ID of the Person who paid for the Expense.
   * @apiSuccess {String}   expenses.person_name        First name and last name of the Person who paid for the Expense.
   * @apiSuccess {Object[]} expenses.debts              List of Debts owed for the Expense.
   * @apiSuccess {Number}   expenses.debts.expense_id   ID of the Expense associated with the Debt.
   * @apiSuccess {Number}   expenses.debts.person_id    ID of the Person associated with the Debt.
   * @apiSuccess {String}   expenses.debts.person_name  First name and last name of the Person who paid for the Expense.
   * @apiSuccess {Number}   expenses.debts.amount       Amount owed for the Debt.
   *
   * @apiSuccessExample {json} Successful-Response:
   * HTTP/1.1 200 OK
   * {
   *  id: 1,
   *  destination: "Paris",
   *  date: "2019-02-20",
   *  active: true,
   *  created_by: "BarryAllen27",
   *  people: [
   *    {
   *      id: 1,
   *      first_name: "Kyle",
   *      last_name: "Rayner",
   *      user_id: null
   *    },
   *    {
   *      id: 2,
   *      first_name: "John",
   *      last_name: "Jones",
   *      user_id: null
   *    },
   *  ]
   *  expenses: [
   *    {
   *      id: 1,
   *      name: "Uber",
   *      person_id: 1,
   *      amount: 20.10,
   *      person_name: "John Jones",
   *      debts: [
   *        {
   *          expense_id: 1,
   *          person_id: 1,
   *          amount: 9.29,
   *          person_name: "Kyle Rayner"
   *        }
   *      ]
   *    }
   *  ]
   * }
   */
  .get((req: Request, res: Response): void => {
    res.status(200).json(req.trip);
  })
  /**
   * @api {put} /api/trips/:id Edit Trip information
   * @apiName EditTrip
   * @apiGroup Trip
   * @apiPermission Trip Editor
   *
   * @apiParam {Number}   id            Trip's unique ID.
   * @apiParam {String}   [destination] Destination or name of the Trip.
   * @apiParam {Date}     [date]        Date of the Trip.
   * @apiParam {Boolean}  [active]      Whether the Trip is active or not.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  destination: "Paris",
   *  date: "2019-09-02"
   * }
   *
   * @apiSuccess (200) {Number} num Number of updated records.
   */
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
  /**
   * @api {put} /api/trips/:id Delete Trip
   * @apiName DeleteTrip
   * @apiGroup Trip
   * @apiPermission Trip Editor
   *
   * @apiParam {Number} id Trip's unique ID.
   *
   * @apiSuccess (200) {Number} num Number of deleted records.
   */
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

/**
 * @api {post} /api/trips/:id/people Add Person for the Trip
 * @apiName AddPerson
 * @apiGroup Trip
 * @apiPermission Trip Editor
 *
 * @apiParam {Number} id          Trip's unique ID.
 * @apiParam {Number} trip_id     Trip's unique ID.
 * @apiParam {String} first_name  Person's first name.
 * @apiParam {String} [last_name] Person's last name.
 * @apiParam {Number} [user_id]   Person's associated User ID.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  trip_id: 2,
 *  first_name: "Steven",
 *  last_name: "Williamson"
 * }
 *
 * @apiSuccess (201) {Number} id ID of the created Person.
 */
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

/**
 * @api {post} /api/trips/:id/expenses Add Expense for the Trip
 * @apiName AddExpense
 * @apiGroup Trip
 * @apiPermission Trip Editor
 *
 * @apiParam {Number} id          Trip's unique ID.
 * @apiParam {Number} trip_id     Trip's unique ID.
 * @apiParam {Number} person_id   ID of the Person who paid for the Expense.
 * @apiParam {String} name        Name of the Expense.
 * @apiParam {Number} amount      Amount paid for the Expense.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  trip_id: 2,
 *  person_id: 4,
 *  name: "Uber",
 *  amount: 20.12
 * }
 *
 * @apiSuccess (201) {Number} id ID of the created Expense.
 */
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
