import { NextFunction, Request, Response } from "express";
import Blog from "../../../models/blog.model";
import { smartTrim, stripHtml } from "../../../helpers/blog.helper";
import { errorHandler } from "../../../helpers/mongo.helper";
import cloudinaryUpload, { cloudinaryDelete } from "../../../utils/cloudinary";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route PUT /api/blog/:slug (admin) | PUT /api/user/blog/:slug (author)
 * @desc Update a blog (multipart, optional `photo` file)
 * @access Private
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const blog: any = await Blog.findOne({ slug }).exec();

    if (!blog) {
      return next(new CustomException(400, "Blog not found"));
    }

    const { body, categories, tags } = req.body as {
      body?: string;
      categories?: string;
      tags?: string;
    };

    // Merge editable text fields while preserving the original slug.
    const slugBeforeMerge = blog.slug;
    Object.assign(blog, req.body);
    blog.slug = slugBeforeMerge;

    if (body) {
      blog.excerpt = smartTrim(body, 320, " ", " ...");
      blog.mdesc = stripHtml(body.substring(0, 160));
    }

    if (categories) {
      blog.categories = categories.split(",");
    }

    if (tags) {
      blog.tags = tags.split(",");
    }

    if (req.file) {
      if (req.file.size > 10000000) {
        return next(
          new CustomException(400, "Image should be less than 10mb in size")
        );
      }

      // Upload the new image, then remove the old one from Cloudinary.
      const oldPhoto = blog.photo;
      const folder = `${req.profile.email}-${req.profile._id}`;
      try {
        blog.photo = await cloudinaryUpload(req.file.path, folder);
        if (oldPhoto) {
          await cloudinaryDelete(oldPhoto).catch((e) => console.error(e));
        }
      } catch (err) {
        console.error(err);
        return next(
          new CustomException(400, "Failed to upload image. Please try again.")
        );
      }
    }

    try {
      await blog.save();
    } catch (err) {
      return next(new CustomException(400, errorHandler(err)));
    }

    return new CustomResponse(res).success("Blog updated", blog, 200);
  } catch (error) {
    return next(error);
  }
};

export { update };
