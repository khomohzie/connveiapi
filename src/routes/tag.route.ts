import express, { Router } from "express";

import { create, list, read, remove } from "../controllers/tag";

import { validate } from "../middlewares/validate.middleware";
import { tagCreateSchema } from "../schema/taxonomy.schema";
import {
  requireSignin,
  adminMiddleware,
} from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post(
  "/tag",
  validate(tagCreateSchema),
  requireSignin,
  adminMiddleware,
  create
);
router.get("/tags", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignin, adminMiddleware, remove);

export default router;
