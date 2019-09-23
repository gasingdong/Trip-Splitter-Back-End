import { Request, Response, NextFunction } from 'express';
import Restricted from '../restricted-middleware';
import PeopleMiddleware from './people-middleware';

const router = require('express').Router();

router
  .route('/:id')
  .all(PeopleMiddleware.validatePersonId)
  .get((req: Request, res: Response): void => {
    res.status(200).json(req.person);
  });

export default router;
