import crypto from "crypto";
import { InferSchemaType, Model, Schema, model } from "mongoose";
import { IUserMethods } from "../interfaces/user.interfaces";

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    profile: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    about: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    // Cloudinary secure URL of the profile photo.
    photo: {
      type: String,
      default: "",
    },
    // Stores the JWT reset-password token. The original schema declared this as
    // `{ data: String, default: "" }` but it was always read/written as a plain
    // string; Mongoose 8 requires the corrected form below.
    resetPasswordLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/**
 * Virtual `password` setter. Assigning to it generates a fresh salt and stores
 * the resulting HMAC-SHA1 hash. This preserves the original hashing scheme so
 * existing accounts keep working.
 */
userSchema
  .virtual("password")
  .set(function (this: any, password: string) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function (this: any) {
    return this._password;
  });

userSchema.methods.authenticate = function (
  this: any,
  plainText: string
): boolean {
  return this.encryptPassword(plainText) === this.hashed_password;
};

userSchema.methods.encryptPassword = function (
  this: any,
  password: string
): string {
  if (!password) return "";

  try {
    return crypto
      .createHmac("sha1", this.salt)
      .update(password)
      .digest("hex");
  } catch (error) {
    return "";
  }
};

userSchema.methods.makeSalt = function (): string {
  return Math.round(new Date().valueOf() * Math.random()) + "";
};

export type TUser = InferSchemaType<typeof userSchema>;

type UserModel = Model<TUser, {}, IUserMethods>;

export default model<TUser, UserModel>("User", userSchema);
