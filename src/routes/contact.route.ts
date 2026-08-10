import express, { Router } from "express";

import { contactForm, contactBlogAuthorForm } from "../controllers/contact";

import { validate } from "../middlewares/validate.middleware";
import { contactFormSchema } from "../schema/contact.schema";

const router: Router = express.Router();

router.post("/contact", validate(contactFormSchema), contactForm);
router.post(
  "/contact-blog-author",
  validate(contactFormSchema),
  contactBlogAuthorForm
);

export default router;
