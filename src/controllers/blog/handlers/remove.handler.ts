import { NextFunction, Request, Response } from "express";
import Blog from "../../../models/blog.model";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route DELETE /api/blog/:slug (admin) | DELETE /api/user/blog/:slug (author)
 * @desc Delete a blog by slug
 * @access Private
 */
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    await Blog.findOneAndDelete({ slug }).exec();

    return new CustomResponse(res).success("Blog deleted successfully", {}, 200);
  } catch (error) {
    return next(error);
  }
};

export { remove };
