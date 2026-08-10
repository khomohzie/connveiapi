import { object, string, TypeOf } from "zod";

export const preSignupSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }).min(
      1,
      "Name is required"
    ),
    email: string({ required_error: "Must be a valid email address" }).email(
      "Must be a valid email address"
    ),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password must be at least 6 characters long"
    ),
  }),
});

export const signinSchema = object({
  body: object({
    email: string({ required_error: "Must be a valid email address" }).email(
      "Must be a valid email address"
    ),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password must be at least 6 characters long"
    ),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Must be a valid email address" }).email(
      "Must be a valid email address"
    ),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    newPassword: string({ required_error: "Password is required" }).min(
      6,
      "Password must be at least 6 characters long"
    ),
  }),
});

export type PreSignupInput = TypeOf<typeof preSignupSchema>["body"];
export type SigninInput = TypeOf<typeof signinSchema>["body"];
