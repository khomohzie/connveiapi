import { CookieOptions } from "express";

// The signed access token is stored as a cookie called `token`, matching the
// original Connvei API. It mirrors the JWT's own 1 day lifetime.
const ONE_DAY_MS = 60 * 60 * 24 * 1000;

const tokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + ONE_DAY_MS),
  maxAge: ONE_DAY_MS,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production (requires HTTPS).
if (process.env.NODE_ENV === "production") tokenCookieOptions.secure = true;

export { tokenCookieOptions };
