import { Request, Response, NextFunction } from 'express';
import Codes from '../../config/codes';
import Trips from './trip-model';
import { Trip } from '../../types';
import Editors from '../editors/editors-model';

declare module 'express-serve-static-core' {
  interface Request {
    trip?: Trip;
  }
}

// Validate that a trip by this id exists
const validateTripId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  // Ensure there's a username
  if (id) {
    try {
      const existingTrip = await Trips.getByTripId(Number(id));

      if (existingTrip) {
        req.trip = {
          ...existingTrip,
          active: Boolean(existingTrip.active),
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

// Validate that a trip has this editor
// Only call after validateTripId
const validateEditor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existingEditor = await Editors.getEditorsByTripId(
      Number(req.params.id)
    );

    if (
      existingEditor.some(editor => editor.id === Number(req.params.editorId))
    ) {
      next();
    } else {
      res.status(404).json(Codes.NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validateTripId,
  validateEditor,
};
