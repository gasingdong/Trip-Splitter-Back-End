import { Request, Response, NextFunction } from 'express';
import Codes from '../../config/codes';
import db from '../../database/db-config';

const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Ensure there's a body at all
  if (!req.body) {
    res.status(400).json(Codes.BAD_REQUEST);
    return;
  }

  const { username, password } = req.body;

  // Ensure there's both a username and password
  if (username && password) {
    const existingUser = await await db('users')
      .where({ username })
      .first();

    if (!existingUser) {
      next();
    } else {
      res.status(200).json(Codes.ID_CONFLICT);
    }
  } else {
    res.status(400).json(Codes.BAD_REQUEST);
  }
};

export default {
  validateUser,
};
