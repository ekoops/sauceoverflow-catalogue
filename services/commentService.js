import Product from "../models/product.js";
import Comment from "../models/comment.js";

import { promisify } from "util";

/**
 * Creates a comment for a given product and persists it
 * @param productId {!string}
 * @param title {!string}
 * @param body {string}
 * @param stars {!number}
 * @returns {!Promise<!Comment>}
 */
const createComment = (productId, { title, body, stars }) => {
  const comment = new Comment({ title, body, stars });
  const updateProduct = promisify(Product.updateOne.bind(Product));

  return updateProduct(
    { _id: productId },
    {
      $push: { comments: comment },
      $inc: {
        starsSum: stars,
        commentsNumber: 1,
      }
    }
  )
    .then(() => comment)
    .catch((err) => {
      throw new Error(`Failed to create a new comment: ${err.message}`);
    });
};
/**
 * Returns all the comment for a given product id
 * @param productId {!string}
 * @param last {number}
 * @param projection {!Object<string, number>}
 * @returns {!Promise<!Comment[]>}
 */
const getCommentsByProductId = (productId, last, projection) => {
  if (last <= 0) throw new Error("Last must be positive.");
  const pipeline = [
    { $match: { _id: productId } },
    { $unwind: "$comments" },
    { $replaceRoot: { newRoot: "$comments" } },
    { $sort: { date: -1 } },
    { $project: projection },
  ];
  if (last) pipeline.push({ $limit: last });
  return Product.aggregate(pipeline);
};

export default { createComment, getCommentsByProductId };
