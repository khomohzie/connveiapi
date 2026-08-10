import { ObjectId } from "mongoose";

export interface IBlog {
  title: string;
  slug: string;
  body: any;
  excerpt?: string;
  mtitle?: string;
  mdesc?: string;
  photo?: {
    data?: Buffer;
    contentType?: string;
  };
  categories: ObjectId[];
  tags: ObjectId[];
  postedBy: ObjectId;
}
