import { Request, Response, NextFunction } from 'express';
import Codes from '../../config/codes';
import Users from '../users/user-model';

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
    const existingUser = await Users.getByUsername(username);

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
