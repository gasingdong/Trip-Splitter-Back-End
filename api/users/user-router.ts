import { Request, Response, NextFunction } from 'express';
import UserMiddleware from './user-middleware';
import Restricted from '../restricted-middleware';
import Users from './user-model';
import { User } from '../../types';

const router = require('express').Router();

router.get(
  '/:username',
  UserMiddleware.validateUsername,
  (req: Request, res: Response): void => {
    res.status(200).json(req.user);
  }
);

router
  .route('/:username/trips')
  .all(UserMiddleware.validateUsername)
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trips = await Users.getTripsByUsername(req.params.username);
      res.status(200).json(trips);
    } catch (err) {
      next(err);
    }
  })
  .post(
    Restricted.restrictedByUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const saved = await Users.addTripForUserId(
          req.body,
          (req.user as User).id
        );
        res.status(201).json(saved);
      } catch (err) {
        next(err);
      }
    }
  );

export default router;
