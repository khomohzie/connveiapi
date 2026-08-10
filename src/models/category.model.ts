import { InferSchemaType, Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export type TCategory = InferSchemaType<typeof categorySchema>;

export default model("Category", categorySchema);
