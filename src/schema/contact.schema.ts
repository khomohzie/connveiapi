import { object, string } from "zod";

export const contactFormSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }).min(
      1,
      "Name is required"
    ),
    email: string({ required_error: "A valid email address is required" }).min(
      1,
      "A valid email address is required"
    ),
    message: string({ required_error: "Message is required" }).min(
      20,
      "Message must be at least 20 characters long"
    ),
  }),
});
