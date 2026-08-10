import express, { Router } from "express";

import { default as blogRoute } from "./blog.route";
import { default as authRoute } from "./auth.route";
import { default as userRoute } from "./user.route";
import { default as categoryRoute } from "./category.route";
import { default as tagRoute } from "./tag.route";
import { default as contactRoute } from "./contact.route";

const router: Router = express.Router();

// Mount order matches the original API to preserve route resolution.
router.use("", blogRoute);
router.use("", authRoute);
router.use("", userRoute);
router.use("", categoryRoute);
router.use("", tagRoute);
router.use("", contactRoute);

export default router;
