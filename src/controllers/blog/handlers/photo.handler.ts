import { NextFunction, Request, Response } from "express";
import Blog from "../../../models/blog.model";
import CustomException from "../../../utils/handlers/error.handler";

/**
 * @route GET /api/blog/photo/:slug
 * @desc Stream a blog's featured image (raw image bytes)
 * @access Public
 */
const photo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const blog = await Blog.findOne({ slug }).select("photo").exec();

    if (!blog || !blog.photo || !blog.photo.data) {
      return next(new CustomException(400, "Photo not found"));
    }

    res.set("Content-Type", blog.photo.contentType as string);
    return res.send(blog.photo.data);
  } catch (error) {
    return next(error);
  }
};

export { photo };
