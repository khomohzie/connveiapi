import { NextFunction, Request, Response } from "express";
import Blog from "../../../models/blog.model";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route GET /api/blog/:slug
 * @desc Read a single blog by slug
 * @access Public
 */
const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const blog = await Blog.findOne({ slug })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username twitter instagram linkedin photo")
      .select(
        "_id title body slug mtitle mdesc photo featured categories tags postedBy createdAt updatedAt"
      )
      .exec();

    return new CustomResponse(res).success("Blog retrieved", blog, 200);
  } catch (error) {
    return next(error);
  }
};

export { read };
