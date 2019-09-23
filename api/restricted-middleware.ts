import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Secrets from '../config/secrets';
import Codes from '../config/codes';

const restrictedByUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, Secrets.JWT_SECRET, (err, decoded) => {
      const decodedToken = JSON.parse(JSON.stringify(decoded));
      if (err || decodedToken.username !== req.params.username) {
        res.status(401).json(Codes.INVALID_CRED);
      } else {
        next();
      }
    });
  } else {
    res.status(401).json(Codes.INVALID_CRED);
  }
};

const restrictedByTrip = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, Secrets.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        const decodedToken = JSON.parse(JSON.stringify(decoded));
        if (err || !req.trip || decodedToken.username !== req.trip.created_by) {
          res.status(401).json(Codes.INVALID_CRED);
        } else {
          next();
        }
      } else {
        res.status(401).json(Codes.INVALID_CRED);
      }
    });
  } else {
    res.status(401).json(Codes.INVALID_CRED);
  }
};

export default {
  restrictedByUser,
  restrictedByTrip,
};
