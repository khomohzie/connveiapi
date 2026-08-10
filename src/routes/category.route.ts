import express, { Router } from "express";

import { create, list, read, remove } from "../controllers/category";

import { validate } from "../middlewares/validate.middleware";
import { categoryCreateSchema } from "../schema/taxonomy.schema";
import {
  requireSignin,
  adminMiddleware,
} from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post(
  "/category",
  validate(categoryCreateSchema),
  requireSignin,
  adminMiddleware,
  create
);
router.get("/categories", list);
router.get("/category/:slug", read);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);

export default router;
