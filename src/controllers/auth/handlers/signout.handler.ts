import { NextFunction, Request, Response } from "express";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route GET /api/signout
 * @desc Clear the auth cookie
 * @access Public
 */
const signout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token");

    return new CustomResponse(res).success("Signout success", {}, 200);
  } catch (error) {
    return next(error);
  }
};

export default signout;
