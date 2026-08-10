import { NextFunction, Request, Response } from "express";
import User from "../../../models/user.model";
import CustomException from "../../../utils/handlers/error.handler";

/**
 * @route GET /api/user/photo/:username
 * @desc Stream a user's profile photo (raw image bytes)
 * @access Public
 */
const photo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).exec();

    if (!user) {
      return next(new CustomException(400, "User not found"));
    }

    if (user.photo && user.photo.data) {
      res.set("Content-Type", user.photo.contentType as string);
      return res.send(user.photo.data);
    }

    return next(new CustomException(404, "Photo not found"));
  } catch (error) {
    return next(error);
  }
};

export { photo };
