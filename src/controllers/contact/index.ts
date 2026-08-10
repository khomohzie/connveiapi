import { NextFunction, Request, Response } from "express";
import Email from "../../services/email.service";
import CustomException from "../../utils/handlers/error.handler";
import CustomResponse from "../../utils/handlers/response.handler";

/**
 * @route POST /api/contact
 * @desc Send a message from the site contact form
 * @access Public
 */
const contactForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, message } = req.body;

    const result = await new Email(email).sendContactEmail(name, email, message);

    if (result.status === true) {
      return new CustomResponse(res).success(
        "Message sent successfully",
        result.meta,
        200
      );
    }

    return next(new CustomException(500, "Failed to send email"));
  } catch (error) {
    return next(error);
  }
};

/**
 * @route POST /api/contact-blog-author
 * @desc Send a message to a blog author (cc's the site admin)
 * @access Public
 */
const contactBlogAuthorForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorEmail, email, name, message } = req.body;

    const maillist = [authorEmail, process.env.EMAIL_TO];

    const result = await new Email(maillist).sendBlogAuthorEmail(
      name,
      email,
      message
    );

    if (result.status === true) {
      return new CustomResponse(res).success(
        "Message sent successfully",
        result.meta,
        200
      );
    }

    return next(new CustomException(500, "Failed to send email"));
  } catch (error) {
    return next(error);
  }
};

export { contactForm, contactBlogAuthorForm };
