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
   * @api {get} /trips/:id Request Trip information
   * @apiName GetTrip
   * @apiGroup Trip
   * @apiPermission Trip Editor
   *
   * @apiParam {Number} id Trip's unique ID.
   *
   * @apiSuccess (params)   {Number}    id                          ID of the Trip.
   * @apiSuccess (content)  {String}    destination                 Destination or name of the Trip.
   * @apiSuccess (content)  {Date}      date                        Date of the Trip.
   * @apiSuccess (content)  {Boolean}   active                      Whether the Trip is active or not.
   * @apiSuccess (content)  {Object[]}  people                      List of People on the Trip.
   * @apiSuccess (content)  {Number}    people.id                   ID of the Person.
   * @apiSuccess (content)  {String}    people.first_name           First name of the Person.
   * @apiSuccess (content)  {String}    people.last_name            Last name of the Person.
   * @apiSuccess (content)  {Number}    people.user_id              The ID of the User associated with the Person.
   * @apiSuccess (content)  {Object[]}  expenses                    List of Expenses on the Trip.
   * @apiSuccess (content)  {Number}    expenses.id                 ID of the Expense.
   * @apiSuccess (content)  {String}    expenses.name               Name or description of the Expense.
   * @apiSuccess (content)  {Number}    expenses.amount             Amount paid for the Expense.
   * @apiSuccess (content)  {Number}    expenses.person_id          ID of the Person who paid for the Expense.
   * @apiSuccess (content)  {String}    expenses.person_name        First name and last name of the Person who paid for the Expense.
   * @apiSuccess (content)  {Object[]}  expenses.debts              List of Debts owed for the Expense.
   * @apiSuccess (content)  {Number}    expenses.debts.expense_id   ID of the Expense associated with the Debt.
   * @apiSuccess (content)  {Number}    expenses.debts.person_id    ID of the Person associated with the Debt.
   * @apiSuccess (content)  {String}    expenses.debts.person_name  First name and last name of the Person who paid for the Expense.
   * @apiSuccess (content)  {Number}    expenses.debts.amount       Amount owed for the Debt.
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
   * @api {put} /trips/:id Edit Trip information
   * @apiName EditTrip
   * @apiGroup Trip
   * @apiPermission Trip Editor
   *
   * @apiParam (params)   {Number}   id            Trip's unique ID.
   * @apiParam (request)  {String}   [destination] Destination or name of the Trip.
   * @apiParam (request)  {Date}     [date]        Date of the Trip.
   * @apiParam (request)  {Boolean}  [active]      Whether the Trip is active or not.
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
   * @api {delete} /trips/:id Delete Trip
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
 * @api {post} /trips/:id/people Add Person for the Trip
 * @apiName AddPerson
 * @apiGroup Trip
 * @apiPermission Trip Editor
 *
 * @apiParam (params)   {Number} id          Trip's unique ID.
 * @apiParam (request)  {String} first_name  Person's first name.
 * @apiParam (request)  {String} [last_name] Person's last name.
 * @apiParam (request)  {Number} [user_id]   Person's associated User ID.
 *
 * @apiParamExample {json} Request-Example:
 * {
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
 * @api {post} /trips/:id/expenses Add Expense for the Trip
 * @apiName AddExpense
 * @apiGroup Trip
 * @apiPermission Trip Editor
 *
 * @apiParam (params)   {Number} id          Trip's unique ID.
 * @apiParam (request)  {Number} person_id   ID of the Person who paid for the Expense.
 * @apiParam (request)  {String} name        Name of the Expense.
 * @apiParam (request)  {Number} amount      Amount paid for the Expense.
 *
 * @apiParamExample {json} Request-Example:
 * {
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
