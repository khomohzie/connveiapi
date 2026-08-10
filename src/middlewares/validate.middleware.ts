import CustomException from "../utils/handlers/error.handler";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

/**
 * Validate `req.params`, `req.query` and `req.body` against a zod schema.
 * On failure it forwards a 422 CustomException to the error middleware.
 */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const messages: string[] = [];
        const paths: string[] = [];

        err.errors.forEach((element) => {
          messages.push(element.message);
          paths.push(`${element.path[1]}`);
        });

        return next(
          new CustomException(422, messages[0], {
            path: paths.join(", "),
            errors: messages,
          })
        );
      }

      next(err);
    }
  };
