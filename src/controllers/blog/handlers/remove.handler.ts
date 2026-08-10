import { NextFunction, Request, Response } from "express";
import Blog from "../../../models/blog.model";
import { cloudinaryDelete } from "../../../utils/cloudinary";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route DELETE /api/blog/:slug (admin) | DELETE /api/user/blog/:slug (author)
 * @desc Delete a blog by slug (and its Cloudinary image)
 * @access Private
 */
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const blog = await Blog.findOneAndDelete({ slug }).exec();

    // Remove the featured image from Cloudinary as well.
    if (blog?.photo) {
      await cloudinaryDelete(blog.photo).catch((e) => console.error(e));
    }

    return new CustomResponse(res).success("Blog deleted successfully", {}, 200);
  } catch (error) {
    return next(error);
  }
};

export { remove };
