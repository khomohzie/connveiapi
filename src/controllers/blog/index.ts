import { create } from "./handlers/create.handler";
import {
  list,
  listAllBlogsCategoriesTags,
  listRelated,
  listSearch,
  listByUser,
} from "./handlers/list.handler";
import { read } from "./handlers/read.handler";
import { update } from "./handlers/update.handler";
import { remove } from "./handlers/remove.handler";
import { photo } from "./handlers/photo.handler";

export {
  create,
  list,
  listAllBlogsCategoriesTags,
  read,
  remove,
  update,
  photo,
  listRelated,
  listSearch,
  listByUser,
};
