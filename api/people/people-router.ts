import { Request, Response, NextFunction } from 'express';
import Restricted from '../restricted-middleware';
import PeopleMiddleware from './people-middleware';

const router = require('express').Router();

router
  .route('/:id')
  .all(PeopleMiddleware.validatePersonId)
  .put((req: Request, res: Response): void => {
    res.status(404).json({});
  })
  .delete((req: Request, res: Response): void => {
    res.status(404).json({});
  });

export default router;
