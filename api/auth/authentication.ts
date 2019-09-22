import jwt from 'jsonwebtoken';
import Secrets from '../../config/secrets';
import { User } from '../../types';

const generateToken = (user: User): string => {
  const payload = {
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, Secrets.JWT_SECRET, options);
};

export default {
  generateToken,
};
