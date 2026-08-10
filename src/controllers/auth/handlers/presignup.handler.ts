import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../../models/user.model";
import Email from "../../../services/email.service";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";
import { PreSignupInput } from "../../../schema/auth.schema";

/**
 * @route POST /api/pre-signup
 * @desc Validate the email is free and email an activation link
 * @access Public
 */
const preSignup = async (
  req: Request<{}, {}, PreSignupInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).exec();

    if (user) {
      return next(new CustomException(400, "Email is taken"));
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const result = await new Email(email).sendActivationEmail(token);

    if (result.status === true) {
      return new CustomResponse(res).success(
        `Email has been sent to ${email}. Follow the instructions to activate your account. Link expires in 10min. Make sure to check your spam folder.`,
        {},
        200,
        result.meta
      );
    }

    return next(
      new CustomException(500, "Failed to send activation email. Try again.", {
        details: result.meta,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export default preSignup;
