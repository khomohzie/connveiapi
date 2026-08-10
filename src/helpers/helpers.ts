import crypto from "crypto";
import { Types } from "mongoose";

/**
 * Generate a short, url-safe unique id. Used to seed a new user's `username`
 * and profile url (replaces the deprecated `shortid` package).
 */
export function generateShortId(): string {
  return crypto.randomBytes(6).toString("base64url");
}

/**
 * Ensure a value is a valid mongoose ObjectId, converting it if necessary.
 */
export function validateId(id: string | Types.ObjectId): Types.ObjectId {
  return new Types.ObjectId(id);
}
