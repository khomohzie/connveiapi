import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import Tag from "../../models/tag.model";
import Blog from "../../models/blog.model";
import { errorHandler } from "../../helpers/mongo.helper";
import CustomException from "../../utils/handlers/error.handler";
import CustomResponse from "../../utils/handlers/response.handler";

/**
 * @route POST /api/tag
 * @desc Create a tag
 * @access Private (admin)
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const tag = new Tag({ name, slug });

    try {
      await tag.save();
    } catch (err) {
      return next(new CustomException(400, errorHandler(err)));
    }

    return new CustomResponse(res).success("Tag created", tag, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route GET /api/tags
 * @desc List all tags
 * @access Public
 */
const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Tag.find({}).exec();

    return new CustomResponse(res).success("Tags retrieved", data, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route GET /api/tag/:slug
 * @desc Read a tag with its blogs
 * @access Public
 */
const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const tag = await Tag.findOne({ slug }).exec();

    if (!tag) {
      return next(new CustomException(400, "Tag not found"));
    }

    const blogs = await Blog.find({ tags: tag })
      .populate("tags", "_id name slug")
      .populate("categories", "_id name slug")
      .populate("postedBy", "_id name username photo")
      .select(
        "_id title slug excerpt photo tags postedBy categories createdAt updatedAt"
      )
      .exec();

    return new CustomResponse(res).success("Tag retrieved", { tag, blogs }, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route DELETE /api/tag/:slug
 * @desc Delete a tag
 * @access Private (admin)
 */
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    await Tag.findOneAndDelete({ slug }).exec();

    return new CustomResponse(res).success("Tag deleted successfully!", {}, 200);
  } catch (error) {
    return next(error);
  }
};

export { create, list, read, remove };
