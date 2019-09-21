import { Request, Response } from 'express';
import UserMiddleware from './user-middleware';

const router = require('express').Router();

router.get(
  '/:username',
  UserMiddleware.validateUsername,
  (req: Request, res: Response): void => {
    res.status(200).json(req.user);
  }
);

export default router;
