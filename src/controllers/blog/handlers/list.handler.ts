import { NextFunction, Request, Response } from "express";
import Blog from "../../../models/blog.model";
import Category from "../../../models/category.model";
import Tag from "../../../models/tag.model";
import User from "../../../models/user.model";
import { errorHandler } from "../../../helpers/mongo.helper";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route GET /api/blogs
 * @desc List every blog
 * @access Public
 */
const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Blog.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username photo")
      .select(
        "_id title slug excerpt photo categories tags postedBy createdAt updatedAt"
      )
      .exec();

    return new CustomResponse(res).success("Blogs retrieved", data, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route POST /api/blogs-categories-tags
 * @desc List blogs (paginated) along with all categories and tags
 * @access Public
 */
const listAllBlogsCategoriesTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = req.body.limit ? parseInt(req.body.limit) : 10;
    const skip = req.body.skip ? parseInt(req.body.skip) : 0;

    const blogs = await Blog.find({})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile photo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "_id title slug excerpt photo categories tags postedBy createdAt updatedAt"
      )
      .exec();

    const categories = await Category.find({}).exec();
    const tags = await Tag.find({}).exec();

    return new CustomResponse(res).success(
      "Blogs, categories and tags retrieved",
      { blogs, categories, tags, size: blogs.length },
      200
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @route POST /api/blogs/related
 * @desc List blogs related to the given blog (same categories)
 * @access Public
 */
const listRelated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const { _id, categories } = req.body.blog;

    const blogs = await Blog.find({
      _id: { $ne: _id },
      categories: { $in: categories },
    })
      .limit(limit)
      .populate("postedBy", "_id name profile username photo")
      .select("title slug excerpt photo postedBy createdAt updatedAt")
      .exec();

    return new CustomResponse(res).success("Related blogs retrieved", blogs, 200);
  } catch (error) {
    return next(new CustomException(400, "Blogs not found"));
  }
};

/**
 * @route GET /api/blogs/search?search=
 * @desc Search blogs by title or body
 * @access Public
 */
const listSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query as { search?: string };

    if (!search) {
      return new CustomResponse(res).success("No search term", [], 200);
    }

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ],
    })
      .select("-body")
      .exec();

    return new CustomResponse(res).success("Search results", blogs, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route GET /api/:username/blogs
 * @desc List blogs written by a given user
 * @access Public
 */
const listByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ username: req.params.username }).exec();

    if (!user) {
      return next(new CustomException(400, "User not found"));
    }

    const data = await Blog.find({ postedBy: user._id })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username photo")
      .sort({ createdAt: -1 })
      .select("_id title slug photo postedBy createdAt updatedAt")
      .exec()
      .catch((err) => {
        throw new CustomException(400, errorHandler(err));
      });

    return new CustomResponse(res).success("Blogs retrieved", data, 200);
  } catch (error) {
    return next(error);
  }
};

export {
  list,
  listAllBlogsCategoriesTags,
  listRelated,
  listSearch,
  listByUser,
};
