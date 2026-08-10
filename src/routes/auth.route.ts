import express, { Router } from "express";

import {
  preSignup,
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/auth";

import { validate } from "../middlewares/validate.middleware";
import {
  preSignupSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schema/auth.schema";

const router: Router = express.Router();

router.post("/pre-signup", validate(preSignupSchema), preSignup);
router.post("/signup", signup);
router.post("/signin", validate(signinSchema), signin);
router.get("/signout", signout);
router.put("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.put("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/google-login", googleLogin);

export default router;
