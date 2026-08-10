import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import Category from "../../models/category.model";
import Blog from "../../models/blog.model";
import { errorHandler } from "../../helpers/mongo.helper";
import CustomException from "../../utils/handlers/error.handler";
import CustomResponse from "../../utils/handlers/response.handler";

/**
 * @route POST /api/category
 * @desc Create a category
 * @access Private (admin)
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const category = new Category({ name, slug });

    try {
      await category.save();
    } catch (err) {
      return next(new CustomException(400, errorHandler(err)));
    }

    return new CustomResponse(res).success("Category created", category, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route GET /api/categories
 * @desc List all categories
 * @access Public
 */
const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Category.find({}).exec();

    return new CustomResponse(res).success("Categories retrieved", data, 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route GET /api/category/:slug
 * @desc Read a category with its blogs
 * @access Public
 */
const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const category = await Category.findOne({ slug }).exec();

    if (!category) {
      return next(new CustomException(400, "Category not found"));
    }

    const blogs = await Blog.find({ categories: category })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username photo")
      .select(
        "_id title slug excerpt photo categories postedBy tags createdAt updatedAt"
      )
      .exec();

    return new CustomResponse(res).success(
      "Category retrieved",
      { category, blogs },
      200
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @route DELETE /api/category/:slug
 * @desc Delete a category
 * @access Private (admin)
 */
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    await Category.findOneAndDelete({ slug }).exec();

    return new CustomResponse(res).success(
      "Category deleted successfully!",
      {},
      200
    );
  } catch (error) {
    return next(error);
  }
};

export { create, list, read, remove };
