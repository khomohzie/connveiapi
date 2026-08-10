import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../../models/user.model";
import { generateShortId } from "../../../helpers/helpers";
import { errorHandler } from "../../../helpers/mongo.helper";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route POST /api/signup
 * @desc Complete signup by verifying the activation token, then create the user
 * @access Public
 */
const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.body.token;

    if (!token) {
      return next(new CustomException(400, "Something went wrong. Try again"));
    }

    let decoded: { name: string; email: string; password: string };

    try {
      decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION) as any;
    } catch (err) {
      return next(new CustomException(401, "Expired link. Signup again"));
    }

    const { name, email, password } = decoded;

    const username = generateShortId();
    const profile = `${process.env.CLIENT_URL}/profile/${username}`;

    const user = new User({ name, email, password, profile, username });

    try {
      await user.save();
    } catch (err) {
      return next(new CustomException(401, errorHandler(err)));
    }

    return new CustomResponse(res).success("Signup success! Please signin", {}, 200);
  } catch (error) {
    return next(error);
  }
};

export default signup;
