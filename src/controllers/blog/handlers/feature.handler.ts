import { NextFunction, Request, Response } from "express";
import Blog from "../../../models/blog.model";
import { errorHandler } from "../../../helpers/mongo.helper";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route GET /api/blogs/featured
 * @desc  Get the blog an admin has pinned as the homepage "featured story of
 *        the moment". Returns `null` when nothing is pinned - the client then
 *        falls back to the most recent story.
 * @access Public
 */
const featured = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findOne({ featured: true })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile photo")
      .select(
        "_id title slug excerpt photo categories tags postedBy featured createdAt updatedAt"
      )
      .exec();

    return new CustomResponse(res).success("Featured blog retrieved", blog, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route PUT /api/blog/:slug/feature
 * @desc  Pin or unpin a blog as the single homepage "featured story". Pinning
 *        one automatically unpins every other, so there is only ever one
 *        featured story at a time. Body: `{ featured: boolean }` (defaults to
 *        featuring when omitted).
 * @access Admin
 */
const feature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const makeFeatured = req.body.featured !== false;

    const blog = await Blog.findOne({ slug }).select("_id slug").exec();

    if (!blog) {
      return next(new CustomException(404, "Blog not found"));
    }

    try {
      if (makeFeatured) {
        // Enforce a single featured story: clear the flag everywhere first.
        await Blog.updateMany(
          { featured: true },
          { $set: { featured: false } }
        );
      }
      await Blog.updateOne(
        { _id: blog._id },
        { $set: { featured: makeFeatured } }
      );
    } catch (err) {
      return next(new CustomException(400, errorHandler(err)));
    }

    return new CustomResponse(res).success(
      makeFeatured
        ? "Story is now featured on the homepage"
        : "Story removed from the homepage feature",
      { slug: blog.slug, featured: makeFeatured },
      200
    );
  } catch (error) {
    return next(error);
  }
};

export { featured, feature };
