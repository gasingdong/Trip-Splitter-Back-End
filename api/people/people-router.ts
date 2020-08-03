import { Request, Response, NextFunction } from 'express';
import Restricted from '../restricted-middleware';
import PeopleMiddleware from './people-middleware';
import People from './people-model';

const router = require('express').Router();

router
  .route('/:id')
  .all([PeopleMiddleware.validatePersonId, Restricted.restrictedByTrip])
  /**
   * @api {put} /people/:id Edit Person information
   * @apiName EditPerson
   * @apiGroup People
   * @apiPermission Trip Editor
   *
   * @apiParam (params)   {Number} id            Person's unique ID.
   * @apiParam (request)  {String} [first_name]  Person's first name.
   * @apiParam (request)  {String} [last_name]   Person's last name.
   * @apiParam (request)  {Number} [user_id]     User ID associated with the Person.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  first_name: "Dill",
   *  last_name: "Pickles"
   * }
   *
   * @apiSuccess (200) {Number} num Number of updated records.
   */
  .put(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = Number(req.params.id);
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { first_name, last_name } = req.body;
        const updated = await People.updatePerson(
          { first_name, last_name },
          id
        );
        res.status(200).json(updated);
      } catch (err) {
        next(err);
      }
    }
  )
  /**
   * @api {delete} /people/:id Delete Person
   * @apiName DeletePerson
   * @apiGroup People
   * @apiPermission Trip Editor
   *
   * @apiParam {Number} id Person's unique ID.
   *
   * @apiSuccess (200) {Number} num Number of deleted records.
   */
  .delete(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const deleted = await People.deletePerson(Number(req.params.id));
        res.status(200).json(deleted);
      } catch (err) {
        next(err);
      }
    }
  );

export default router;
