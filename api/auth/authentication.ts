import jwt from 'jsonwebtoken';
import Secrets from '../../config/secrets';
import Trips from '../trips/trip-model';
import { User } from '../../types';

const generateToken = async (user: User): Promise<string> => {
  try {
    const trips = (await Trips.getTripsByUsername(user.username)).map(
      trip => trip.id
    );
    const payload = {
      username: user.username,
      trips,
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
