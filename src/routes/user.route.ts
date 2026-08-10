import express, { Router } from "express";
import uploader from "../config/uploader";

import {
  read,
  publicProfile,
  update,
  profiles,
} from "../controllers/user";

import {
  requireSignin,
  authMiddleware,
} from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.get("/user/profile", requireSignin, authMiddleware, read);
router.get("/users/profiles", profiles);
router.put(
  "/user/update",
  requireSignin,
  authMiddleware,
  uploader.single("photo"),
  update
);
router.get("/user/:username", publicProfile);

export default router;
