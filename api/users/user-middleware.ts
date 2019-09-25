import { Request, Response, NextFunction } from 'express';
import Codes from '../../config/codes';
import Users from './user-model';
import { Trip, User, Friend } from '../../types';
import Friends from '../friends/friends-model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      username: string;
      photo: string;
      trips: Trip[];
      friends: Friend[];
    };
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
    try {
      const existingUser = await Users.getByUsername(username);

      if (existingUser) {
        req.user = {
          id: existingUser.id,
          username: existingUser.username,
          photo: existingUser.photo,
          trips: existingUser.trips,
          friends: existingUser.friends,
        };
        next();
      } else {
        res.status(404).json(Codes.NOT_FOUND);
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json(Codes.BAD_REQUEST);
  }
};

const validateFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.friendId);
  const userId = (req.user as User).id;

  // Ensure there's an id and it's not the user themselves
  if (id && userId !== id) {
    try {
      const existingUser = await Users.getById(id);

      if (existingUser) {
        next();
      } else {
        res.status(404).json(Codes.NOT_FOUND);
      }
    } catch (err) {
      next(err);
    }
  } else {
    console.log('friend', id, userId);
    res.status(400).json(Codes.BAD_REQUEST);
  }
};

const validateFriendship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, friendId } = req.params;

  // Ensure there's an username and id
  if (username && friendId) {
    try {
      const friendship = await Friends.getFriendsByUsername(username);

      if (
        friendship &&
        friendship.some(friend => friend.id === Number(friendId))
      ) {
        next();
      } else {
        res.status(404).json(Codes.NOT_FOUND);
      }
    } catch (err) {
      next(err);
    }
  } else {
    console.log('friendship', username, friendId);
    res.status(400).json(Codes.BAD_REQUEST);
  }
};

export default {
  validateUsername,
  validateFriend,
  validateFriendship,
};
