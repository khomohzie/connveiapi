import { NextFunction, Request, Response } from "express";
import User from "../../../models/user.model";
import Blog from "../../../models/blog.model";
import { errorHandler } from "../../../helpers/mongo.helper";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route GET /api/user/profile
 * @desc Return the signed-in user's own profile
 * @access Private
 */
const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = req.profile as any;
    profile.hashed_password = undefined;

    return new CustomResponse(res).success("Profile retrieved", profile, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route GET /api/user/:username
 * @desc Return a public profile with the user's recent blogs
 * @access Public
 */
const publicProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).exec();

    if (!user) {
      return next(new CustomException(400, "User not found"));
    }

    const blogs = await Blog.find({ postedBy: user._id })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username photo")
      .limit(10)
      .select(
        "_id title slug excerpt photo categories tags postedBy createdAt updatedAt"
      )
      .exec()
      .catch((err) => {
        throw new CustomException(400, errorHandler(err));
      });

    const publicUser = user as any;
    publicUser.hashed_password = undefined;

    return new CustomResponse(res).success(
      "Public profile retrieved",
      { user: publicUser, blogs },
      200
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @route GET /api/users/profiles
 * @desc List all profiles (name + username)
 * @access Public
 */
const profiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profiles = await User.find(
      {},
      { _id: 0, name: 1, username: 1, photo: 1 }
    ).exec();

    return new CustomResponse(res).success(
      "Profiles retrieved",
      { profiles },
      200
    );
  } catch (error) {
    return next(new CustomException(404, "Could not get profiles."));
  }
};

export { read, publicProfile, profiles };
