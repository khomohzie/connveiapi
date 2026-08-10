import { NextFunction, Request, Response } from "express";
import User from "../../../models/user.model";
import { signJwt } from "../../../utils/jwt.utils";
import { tokenCookieOptions } from "../../../config/jwt.config";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";
import { SigninInput } from "../../../schema/auth.schema";

/**
 * @route POST /api/signin
 * @desc Authenticate a user and issue a JWT
 * @access Public
 */
const signin = async (
  req: Request<{}, {}, SigninInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return next(
        new CustomException(
          400,
          "User with that email does not exist. Please signup."
        )
      );
    }

    if (!user.authenticate(password)) {
      return next(
        new CustomException(400, "Email and password do not match.")
      );
    }

    const token = signJwt({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, tokenCookieOptions);

    const { _id, username, name, role } = user;

    return new CustomResponse(res).success(
      "Signin success!",
      {
        token,
        user: { _id, username, name, email: user.email, role },
      },
      200
    );
  } catch (error) {
    return next(error);
  }
};

export default signin;
