import { object, string } from "zod";

export const categoryCreateSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }).min(
      1,
      "Name is required"
    ),
  }),
});

export const tagCreateSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }).min(
      1,
      "Name is required"
    ),
  }),
});
