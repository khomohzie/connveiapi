import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import Blog from "../../../models/blog.model";
import { smartTrim, stripHtml } from "../../../helpers/blog.helper";
import { errorHandler } from "../../../helpers/mongo.helper";
import cloudinaryUpload from "../../../utils/cloudinary";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route POST /api/blog  (admin) | POST /api/user/blog (author)
 * @desc Create a new blog (multipart, `photo` file required)
 * @access Private
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, body, categories, tags } = req.body as {
      title?: string;
      body?: string;
      categories?: string;
      tags?: string;
    };

    if (!title || !title.length) {
      return next(new CustomException(400, "title is required"));
    }

    if (!body || body.length < 200) {
      return next(new CustomException(400, "Content is too short"));
    }

    if (!categories || categories.length === 0) {
      return next(new CustomException(400, "At least one category is required"));
    }

    if (!tags || tags.length === 0) {
      return next(new CustomException(400, "At least one tag is required"));
    }

    if (!req.file) {
      return next(new CustomException(400, "A featured image is required"));
    }

    if (req.file.size > 10000000) {
      return next(
        new CustomException(400, "Image should not be more than 10mb in size")
      );
    }

    const blog: any = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(stripHtml(body), 320, " ", " ...");
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    blog.mdesc = stripHtml(body).substring(0, 160);
    blog.postedBy = req.user._id;
    blog.categories = categories.split(",");
    blog.tags = tags.split(",");

    // Upload the featured image to Cloudinary and store its secure URL.
    const folder = `${req.profile.email}-${req.profile._id}`;
    try {
      blog.photo = await cloudinaryUpload(req.file.path, folder);
    } catch (err) {
      console.error(err);
      return next(
        new CustomException(400, "Failed to upload image. Please try again.")
      );
    }

    try {
      await blog.save();
    } catch (err) {
      return next(new CustomException(400, errorHandler(err)));
    }

    return new CustomResponse(res).success("Blog created", blog, 200);
  } catch (error) {
    return next(error);
  }
};

export { create };
