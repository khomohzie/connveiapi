import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../../../models/user.model";
import { signJwt } from "../../../utils/jwt.utils";
import { tokenCookieOptions } from "../../../config/jwt.config";
import { generateShortId } from "../../../helpers/helpers";
import { errorHandler } from "../../../helpers/mongo.helper";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @route POST /api/google-login
 * @desc Sign in (or register) a user with a Google ID token
 * @access Public
 */
const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idToken: string | undefined = req.body.tokenId;

    if (!idToken) {
      return next(
        new CustomException(400, "The verifyIdToken method requires an ID Token")
      );
    }

    const response = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = response.getPayload();

    if (!payload || !payload.email_verified) {
      return next(new CustomException(400, "Google login failed. Try again."));
    }

    const { name, email } = payload;
    // `jti` (JWT ID) seeds the auto-generated password for Google sign ups.
    const jti = (payload as any).jti;

    let user = await User.findOne({ email }).exec();

    if (!user) {
      const username = generateShortId();
      const profile = `${process.env.CLIENT_URL}/profile/${username}`;

      user = new User({ name, email, profile, username, password: jti });

      try {
        await user.save();
      } catch (err) {
        return next(new CustomException(400, errorHandler(err)));
      }
    }

    const token = signJwt({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, tokenCookieOptions);

    const { _id, role, username, photo } = user;

    return new CustomResponse(res).success(
      "Google login success!",
      {
        token,
        user: { _id, email: user.email, name: user.name, role, username, photo },
      },
      200
    );
  } catch (error) {
    return next(error);
  }
};

export default googleLogin;
