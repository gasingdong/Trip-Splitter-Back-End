import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import Users from '../users/user-model';
import AuthMiddleware from './auth-middleware';
import Authenticate from './authentication';
import Codes from '../../config/codes';
import db from '../../database/db-config';

const router = require('express').Router();

/**
 * @api {post} /api/auth/register Register new User
 * @apiName RegisterUser
 * @apiGroup Authorization
 *
 * @apiParam {String} username Username for the User, unique.
 * @apiParam {String} password Password for the User.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  username: "BarryAllen27",
 *  password: "nightmonkey"
 * }
 *
 * @apiSuccess (201) {Number[]} id ID of the new User.
 *
 */
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

/**
 * @api {post} /api/auth/login Authorize User
 * @apiName LoginUser
 * @apiGroup Authorization
 *
 * @apiParam {String} username Username for the User.
 * @apiParam {String} password Password for the User.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  username: "BarryAllen27",
 *  password: "nightmonkey"
 * }
 *
 * @apiSuccess {String} token An authorization token for the User.
 *
 * @apiSuccessExample Successful-Response:
 * HTTP/1.1 200 OK
 * {
 *  token: "1925uijh384325214jsafjiaj2"
 * }
 */
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (username && password) {
      try {
        const user = await db('users')
          .where({ username })
          .first();
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = await Authenticate.generateToken(user);
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
