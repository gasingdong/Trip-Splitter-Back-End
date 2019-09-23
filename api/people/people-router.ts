import { Request, Response, NextFunction } from 'express';
import Restricted from '../restricted-middleware';
import PeopleMiddleware from './people-middleware';
import People from './people-model';

const router = require('express').Router();

router
  .route('/:id')
  .all([PeopleMiddleware.validatePersonId, Restricted.restrictedByTrip])
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
