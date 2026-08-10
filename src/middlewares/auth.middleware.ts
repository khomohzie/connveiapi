import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import Blog from "../models/blog.model";
import { verifyJwt } from "../utils/jwt.utils";
import CustomException from "../utils/handlers/error.handler";
import { errorHandler } from "../helpers/mongo.helper";

/**
 * Require a valid `Authorization: Bearer <token>` access token. The decoded
 * payload (`{ _id }`) is attached to `req.user`.
 */
export const requireSignin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(
      new CustomException(401, "You must be logged in to access this feature.")
    );
  }

  const token = authorization.split(" ")[1];

  const decoded = verifyJwt<{ _id: string }>(token, process.env.JWT_SECRET);

  if (!decoded || !decoded._id) {
    return next(
      new CustomException(401, "Access expired. Please log in to continue.")
    );
  }

  req.user = { _id: decoded._id };
  next();
};

/**
 * Load the signed-in user and attach it to `req.profile`.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user._id).exec();

    if (!user) {
      return next(new CustomException(400, "User not found"));
    }

    req.profile = user as any;
    next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Only allow administrators (role === 1).
 */
export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user._id).exec();

    if (!user) {
      return next(new CustomException(400, "User not found"));
    }

    if (user.role !== 1) {
      return next(
        new CustomException(403, "Admin resource. Access denied!")
      );
    }

    req.profile = user as any;
    next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Ensure the signed-in user owns the blog they are trying to update/delete.
 */
export const canUpdateDeleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const blog = await Blog.findOne({ slug }).exec();

    if (!blog) {
      return next(new CustomException(400, "Blog not found"));
    }

    const authorizedUser =
      blog.postedBy?.toString() === req.profile._id.toString();

    if (!authorizedUser) {
      return next(new CustomException(400, "You are not authorized"));
    }

    next();
  } catch (error) {
    return next(new CustomException(400, errorHandler(error)));
  }
};
