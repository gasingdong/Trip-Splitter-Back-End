import { Request, Response, NextFunction } from 'express';
import UserMiddleware from './user-middleware';
import Restricted from '../restricted-middleware';
import Trips from '../trips/trip-model';
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
   * @apiParam {String}   username        User's unique username.
   * @apiParam {String}   [destination]   Trip's destination or name.
   * @apiParam {Date}     [date]          Trip's date.
   * @apiParam {Boolean}  [active=true]   Whether the Trip is active or not.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  destination: "Paris",
   *  date: "2019-09-02"
   * }
   *
   * @apiSuccess (201) {Number} id ID of the created Trip.
   */
  .post(
    Restricted.restrictedByUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const saved = await Trips.addTripForUserId(
          req.body,
          (req.user as User).id
        );
        res.status(201).json(saved);
      } catch (err) {
        next(err);
      }
    }
  );

export default router;
