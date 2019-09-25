import { Request, Response, NextFunction } from 'express';
import UserMiddleware from './user-middleware';
import Restricted from '../restricted-middleware';
import Trips from '../trips/trip-model';
import Users from './user-model';
import Friends from '../friends/friends-model';
import { User } from '../../types';

const router = require('express').Router();

/**
 * @api {get} /:username Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} username User's unique username.
 *
 * @apiSuccess {Number}   id                ID of the User.
 * @apiSuccess {String}   username          Username of the User.
 * @apiSuccess {String}   photo             Profile photo location of the User.
 * @apiSuccess {Object[]} trips             List of trips created by the User.
 * @apiSuccess {Number}   trips.id          ID of the Trip.
 * @apiSuccess {String}   trips.destination Destination or name for the Trip.
 * @apiSuccess {Date}     trips.date        Date of the Trip.
 * @apiSuccess {Boolean}  trips.active      Whether the Trip it active or inactive.
 * @apiSuccess {Number}   trips.num_people  The number of people associated with the Trip.
 * @apiSuccess {Object[]} friends           List of friends of the User.
 * @apiSuccess {Number}   friends.id        User ID of the Friend.
 * @apiSuccess {String}   friends.username  Username of the Friend.
 *
 * @apiSuccessExample Successful-Response:
 * HTTP/1.1 200 OK
 * {
 *  id: 1,
 *  username: "BarryAllen27"
 *  photo: null,
 *  trips: [
 *    {
 *      id: 1,
 *      destination: "Paris",
 *      date: null,
 *      active: true,
 *      num_people: 4
 *    }
 *  ],
 *  friends: [
 *    {
 *      id: 3,
 *      username: "SpiderPig"
 *    }
 *  ]
 * }
 */
router.get(
  '/:username',
  UserMiddleware.validateUsername,
  (req: Request, res: Response): void => {
    res.status(200).json(req.user);
  }
);

router
  .route('/:username/trips')
  .all(UserMiddleware.validateUsername)
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trips = await Trips.getTripsByUsername(req.params.username);
      res.status(200).json(trips);
    } catch (err) {
      next(err);
    }
  })
  /**
   * @api {post} /:username/trips Add Trip for the User
   * @apiName CreateTrip
   * @apiGroup User
   * @apiPermission User
   *
   * @apiParam (params)   {String}   username        User's unique username.
   * @apiParam (request)  {String}   [destination]   Trip's destination or name.
   * @apiParam (request)  {Date}     [date]          Trip's date.
   * @apiParam (request)  {Boolean}  [active=true]   Whether the Trip is active or not.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  destination: "Paris",
   *  date: "2019-09-02"
   * }
   *
   * @apiSuccessExample Successful-Response:
   * HTTP/1.1 201 OK
   * {
   *  id: 1,
   *  username: "BarryAllen27"
   *  photo: null,
   *  trips: [
   *    {
   *      id: 1,
   *      destination: "Paris",
   *      date: null,
   *      active: true,
   *      num_people: 4
   *    }
   *  ]
   * }
   */
  .post(
    Restricted.restrictedByUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user as User;
        await Trips.addTripForUserId(req.body, user.id);
        const updatedUser = await Users.getByUsername(user.username);

        if (updatedUser) {
          res.status(201).json({
            id: updatedUser.id,
            username: updatedUser.username,
            photo: updatedUser.photo,
            trips: updatedUser.trips,
          });
        } else {
          throw new Error();
        }
      } catch (err) {
        next(err);
      }
    }
  );

/**
 * @api {post} /:username/friends Add Friend for the User
 * @apiName CreateFriend
 * @apiGroup User
 * @apiPermission User
 *
 * @apiParam (params)   {String}   username User's unique username.
 * @apiParam (request)  {String}   id       Friend's unique User ID.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  id: 10
 * }
 *
 * @apiSuccess (201) {Number} id ID of the added Friend.
 */
router.post(
  '/:username/friends',
  [UserMiddleware.validateUsername, Restricted.restrictedByUser],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const saved = await Friends.addFriendToUser(
        (req.user as User).id,
        req.body.id
      );
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @api {delete} /:username/friends/:id Delete Friend
 * @apiName DeleteFriend
 * @apiGroup User
 * @apiPermission User
 *
 * @apiParam (params)   {String}   username User's unique username.
 * @apiParam (request)  {String}   id       Friend's unique User ID.
 *
 * @apiSuccess (200) {Number} num Number of deleted records.
 */
router.delete(
  '/:username/friends/:friendId',
  [
    UserMiddleware.validateUsername,
    Restricted.restrictedByUser,
    UserMiddleware.validateFriend,
    UserMiddleware.validateFriendship,
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await Friends.deleteFriend(
        (req.user as User).id,
        Number(req.params.friendId)
      );
      res.status(200).json(deleted);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
