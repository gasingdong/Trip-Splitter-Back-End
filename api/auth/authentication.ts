import jwt from 'jsonwebtoken';
import Secrets from '../../config/secrets';
import { User } from '../../types';

const generateToken = async (user: User): Promise<string> => {
  try {
    const payload = {
      username: user.username,
    };
    const options = {
      expiresIn: '1d',
    };
    return jwt.sign(payload, Secrets.JWT_SECRET, options);
  } catch (err) {
    console.log(err);
  }
  return '';
};

export default {
  generateToken,
};
