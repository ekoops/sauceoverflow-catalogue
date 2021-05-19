import Product from "../models/product.js";
import { Comment } from "../models/comment.js";

import { promisify } from "util";

const createComment = async ({ productId, ...commentParams }, selection) => {
  const comment = new Comment({ ...commentParams });
  const promisifiedUpdateOne = promisify(Product.updateOne.bind(Product));
  return await promisifiedUpdateOne(
    { _id: productId },
    { $push: { "$.comments": comment }, projection: selection }
  );
};

export default { createComment };
