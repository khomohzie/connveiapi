import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../../models/user.model";
import Email from "../../../services/email.service";
import { errorHandler } from "../../../helpers/mongo.helper";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route PUT /api/forgot-password
 * @desc Email a password reset link
 * @access Public
 */
const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email }: { email: string } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return next(
        new CustomException(401, "User with that email does not exist")
      );
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );

    await User.updateOne(
      { _id: user._id },
      { resetPasswordLink: token }
    ).exec();

    const result = await new Email(email).sendResetEmail(token);

    if (result.status === true) {
      return new CustomResponse(res).success(
        `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min. Make sure to check your spam folder.`,
        {},
        200,
        result.meta
      );
    }

    return next(
      new CustomException(500, "Failed to send reset link. Try again.", {
        details: result.meta,
      })
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @route PUT /api/reset-password
 * @desc Reset a password using a valid reset link token
 * @access Public
 */
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resetPasswordLink, newPassword } = req.body;

    if (!resetPasswordLink) {
      return next(new CustomException(400, "Reset link is required"));
    }

    try {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD);
    } catch (err) {
      return next(new CustomException(401, "Expired link! Try again"));
    }

    const user = await User.findOne({ resetPasswordLink }).exec();

    if (!user) {
      return next(new CustomException(401, "Something went wrong ☻ Try later"));
    }

    (user as any).password = newPassword;
    (user as any).resetPasswordLink = "";

    try {
      await user.save();
    } catch (err) {
      return next(new CustomException(400, errorHandler(err)));
    }

    return new CustomResponse(res).success(
      "Great! Now you can login with your new password",
      {},
      200
    );
  } catch (error) {
    return next(error);
  }
};

export { forgotPassword, resetPassword };
