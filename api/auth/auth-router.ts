import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import Users from '../users/user-model';
import AuthMiddleware from './auth-middleware';
import Authenticate from './authentication';
import Codes from '../../config/codes';

const router = require('express').Router();

router.post(
  '/register',
  AuthMiddleware.validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.body;
      const password = bcryptjs.hashSync(req.body.password);
      const saved = await Users.add({ username, password });
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (username && password) {
      try {
        const user = await Users.getByUsername(username);
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = Authenticate.generateToken(user);
          res.status(200).json({ token });
        } else {
          res.status(401).json(Codes.INVALID_CRED);
        }
      } catch (err) {
        next(err);
      }
    } else {
      res.status(400).json(Codes.BAD_REQUEST);
    }
  }
);

export default router;
