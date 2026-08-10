import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import { errorHandler } from "../../../helpers/mongo.helper";
import cloudinaryUpload, { cloudinaryDelete } from "../../../utils/cloudinary";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route PUT /api/user/update
 * @desc Update the signed-in user's profile (multipart, optional `photo` file)
 * @access Private
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.profile as any;
    const fields = { ...req.body };

    // Preserve role and email - they cannot be changed here.
    const existingRole = user.role;
    const existingEmail = user.email;

    if (fields.username && fields.username.length > 12) {
      return next(
        new CustomException(400, "Username should be less than 12 characters long")
      );
    }

    if (fields.username) {
      fields.username = slugify(fields.username).toLowerCase();
      user.profile = `${process.env.CLIENT_URL}/profile/${fields.username}`;
    }

    if (fields.password && fields.password.length < 6) {
      return next(
        new CustomException(400, "Password should be min 6 characters long")
      );
    }

    Object.assign(user, fields);

    user.role = existingRole;
    user.email = existingEmail;

    if (req.file) {
      if (req.file.size > 10000000) {
        return next(new CustomException(400, "Image should be less than 10mb"));
      }

      // Upload the new avatar, then remove the previous one from Cloudinary.
      const oldPhoto = user.photo;
      const folder = `${existingEmail}-${user._id}`;
      try {
        user.photo = await cloudinaryUpload(req.file.path, folder);
        if (oldPhoto) {
          await cloudinaryDelete(oldPhoto).catch((e: any) => console.error(e));
        }
      } catch (err) {
        console.error(err);
        return next(
          new CustomException(400, "Failed to upload image. Please try again.")
        );
      }
    }

    try {
      await user.save();
    } catch (err) {
      console.log("profile update error", err);
      return next(new CustomException(400, errorHandler(err)));
    }

    user.hashed_password = undefined;
    user.salt = undefined;

    return new CustomResponse(res).success("Profile updated", user, 200);
  } catch (error) {
    return next(error);
  }
};

export { update };
