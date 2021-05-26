import Product from "../models/product.js";
import { promisify } from "util";

/**
 * Creates a product and persists it
 * @param name {!string}
 * @param description {string}
 * @param price {!number}
 * @param category {!string}
 * @returns {!Promise<!Product>}
 */
const createProduct = ({ name, description, price, category }) => {
  const createProduct = promisify(Product.create.bind(Product));
  return createProduct({
    name,
    description,
    price,
    category,
  }).catch((err) => {
    throw new Error(`Failed to create a new product: ${err.message}`);
  });
};

/**
 * Returns the product matching the given product id
 * @param productId {!string}
 * @param projection {!Object<string, number>}
 * @returns {!Promise<Product>}
 */
const getProductById = (productId, projection) => {
  const findProductById = promisify(Product.findById.bind(Product));
  delete projection.comments;
  if ('stars' in projection) {
    projection = {
      ...projection,
      commentsNumber: 1,
      starsSum: 1,
    };
  }
  return findProductById(productId, projection).catch((err) => {
    throw new Error(`Failed to get the product(${productId}): ${err.message}`);
  });
};

/**
 * Returns all the products matching the filter
 * @param clientFilter {Object<string, string | number>}
 * @param clientSort {Object<string, string>}
 * @param projection {!Object<string, number>}
 * @returns {!Promise<!Product[]>}
 */
const getProducts = ({ clientFilter, clientSort }, projection) => {
  const pipeline = [];
  delete projection.comments;
  const project1 = { $project: { comments: 0 } };
  pipeline.push(project1);

  // If stars is required in projection, we perform the calculation sum/count
  if ('stars' in projection) {
    const addStars = {
      $addFields: {
        stars: {
          $cond: [
            { $eq: [0, '$commentsNumber'] },
            0,
            { $divide: ['$starsSum', '$commentsNumber'] },
          ],
        },
      },
    };
    pipeline.push(addStars);
  }

  // clientFilter is an object that contains the required graphql filters
  if (clientFilter && Object.keys(clientFilter).length !== 0) {
    const match = { $match: {} };

    // only products in the specified category
    if (clientFilter.categories)
      match.$match.category = { $in: clientFilter.categories };

    //  only products with the specified minimum number of stars
    if (clientFilter.minStars)
      match.$match.stars = { $gte: clientFilter.minStars };

    //  only products with the specified minimum price
    if (clientFilter.minPrice)
      match.$match.price = { $gte: clientFilter.minPrice };

    //  only products with the specified maximum price
    if (clientFilter.maxPrice)
      match.$match.price = {
        ...match.$match.price,
        $lte: clientFilter.maxPrice,
      };
    pipeline.push(match);
  }

  // if the client required a sort, let's add it as the last operation in the pipeline
  if (clientSort) {
    const sort = {
      $sort: { [clientSort.value]: clientSort.order === 'asc' ? 1 : -1 },
    };
    pipeline.push(sort);
  }

  // in the end we filter out not required fields
  const project2 = { $project: projection };
  pipeline.push(project2);

  return Product.aggregate(pipeline)
    .catch((err) => {
      throw new Error(err);
    });
};


export default { createProduct, getProductById, getProducts };


