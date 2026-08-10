import express, { Router } from "express";
import uploader from "../config/uploader";

import {
  create,
  list,
  listAllBlogsCategoriesTags,
  read,
  remove,
  update,
  photo,
  listRelated,
  listSearch,
  listByUser,
} from "../controllers/blog";

import {
  requireSignin,
  adminMiddleware,
  authMiddleware,
  canUpdateDeleteBlog,
} from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.post(
  "/blog",
  requireSignin,
  adminMiddleware,
  uploader.single("photo"),
  create
);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blogs/search", listSearch);
router.post("/blogs/related", listRelated);
router.get("/blog/photo/:slug", photo);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
router.put(
  "/blog/:slug",
  requireSignin,
  adminMiddleware,
  uploader.single("photo"),
  update
);

// Authenticated (non-admin) author blog CRUD
router.post(
  "/user/blog",
  requireSignin,
  authMiddleware,
  uploader.single("photo"),
  create
);
router.get("/:username/blogs", listByUser);
router.delete(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  remove
);
router.put(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  uploader.single("photo"),
  update
);

export default router;
