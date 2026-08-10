import jwt, { SignOptions } from "jsonwebtoken";

/**
 * Sign a JWT with the given secret (HS256). Matches the original Connvei tokens
 * so previously-issued tokens and env secrets keep working.
 */
export const signJwt = (
  payload: Object,
  secret: string,
  options: SignOptions = {}
): string => {
  return jwt.sign(payload, secret, options);
};

/**
 * Verify a JWT and return its decoded payload, or `null` if invalid/expired.
 */
export const verifyJwt = <T>(token: string, secret: string): T | null => {
  try {
    return jwt.verify(token, secret) as T;
  } catch (error) {
    return null;
  }
};
