import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import { errorHandler } from "../../../helpers/mongo.helper";
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
        return next(new CustomException(400, "Image should be less than 1mb"));
      }
      user.photo.data = req.file.buffer;
      user.photo.contentType = req.file.mimetype;
    }

    try {
      await user.save();
    } catch (err) {
      console.log("profile update error", err);
      return next(new CustomException(400, errorHandler(err)));
    }

    user.hashed_password = undefined;
    user.salt = undefined;
    user.photo = undefined;

    return new CustomResponse(res).success("Profile updated", user, 200);
  } catch (error) {
    return next(error);
  }
};

export { update };
