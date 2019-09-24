import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import AuthRouter from './auth/auth-router';
import UserRouter from './users/user-router';
import TripRouter from './trips/trip-router';
import PersonRouter from './people/people-router';
import ExpensesRouter from './expenses/expenses-router';
import Codes from '../config/codes';

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/docs', express.static('./docs'));
server.use('/api/auth', AuthRouter);
server.use('/api/users', UserRouter);
server.use('/api/trips', TripRouter);
server.use('/api/people', PersonRouter);
server.use('/api/expenses', ExpensesRouter);

const errorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(err);
  }
  console.log(err);
  res.status(500).json(Codes.SERVER_ERR);
};

server.use(errorHandler);

export default server;
