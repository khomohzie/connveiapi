import { NextFunction, Request, Response } from "express";
import Blog from "../../../models/blog.model";
import CustomException from "../../../utils/handlers/error.handler";

/**
 * @route GET /api/blog/photo/:slug
 * @desc Redirect to the blog's featured image (now hosted on Cloudinary)
 * @access Public
 */
const photo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const blog = await Blog.findOne({ slug }).select("photo").exec();

    if (!blog || !blog.photo) {
      return next(new CustomException(404, "Photo not found"));
    }

    return res.redirect(blog.photo);
  } catch (error) {
    return next(error);
  }
};

export { photo };
