import Product from "../models/product.js";
import { Comment } from "../models/comment.js";

import { promisify } from "util";

const createComment = async ({ productId, ...commentParams }) => {
  const comment = new Comment({ ...commentParams });
  const promisifiedUpdateOne = promisify(Product.updateOne.bind(Product));
  return await promisifiedUpdateOne(
    { _id: productId },
    { $push: { "$.comments": comment } }
  );
};

export default { createComment };
