import { NextFunction, Request, Response } from "express";
import User from "../../../models/user.model";
import CustomException from "../../../utils/handlers/error.handler";

/**
 * @route GET /api/user/photo/:username
 * @desc Redirect to the user's profile photo (now hosted on Cloudinary)
 * @access Public
 */
const photo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("photo").exec();

    if (!user || !user.photo) {
      return next(new CustomException(404, "Photo not found"));
    }

    return res.redirect(user.photo);
  } catch (error) {
    return next(error);
  }
};

export { photo };
