import { Request, Response, NextFunction } from 'express';
import Codes from '../../config/codes';
import Users from './user-model';
import { User } from '../../types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

const validateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username } = req.params;

  // Ensure there's a username
  if (username) {
    const existingUser = await Users.getByUsername(username);

    if (existingUser) {
      req.user = existingUser;
      next();
    } else {
      res.status(404).json(Codes.NOT_FOUND);
    }
  } else {
    res.status(400).json(Codes.BAD_REQUEST);
  }
};

export default {
  validateUsername,
};
