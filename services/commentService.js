import Product from "../models/product.js";
import Comment from "../models/comment.js";

import { promisify } from "util";

const createComment = (productId, { title, body, stars }, projection) => {
  const comment = new Comment({ title, body, stars });
  const updateProduct = promisify(Product.updateOne.bind(Product));

  return updateProduct(
    { _id: productId },
    {
      $push: { comments: comment },
      $inc: {
        starsSum: stars,
        commentsNumber: 1,
      },
      projection,
    }
  )
    .then(() => comment)
    .catch(() => {
      throw new Error("Failed to create a new comment");
    });
};

const getCommentsByProductId = (productId, last, projection) => {
  const pipeline = [
    { $match: { _id: productId } },
    { $unwind: "$comments" },
    { $project: projection },
    { $sort: { createdAt: -1 } },
  ];
  if (last) pipeline.push({ $limit: last });
  return Product.aggregate(pipeline);
};

export default { createComment, getCommentsByProductId };
