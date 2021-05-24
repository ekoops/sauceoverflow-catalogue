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
  if ("stars" in projection) {
    projection = { ...projection, commentsNumber: 1, starsSum: 1 };
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
  const getProducts = promisify(Product.find.bind(Product));
  delete projection.comments;
  const f = {};
  const o = {};
  if (clientFilter) {
    if (clientFilter.categories) f.category = { $in: clientFilter.categories };
    if (clientFilter.minStars) f.stars = { $gte: clientFilter.minStars };
    if (clientFilter.minPrice) f.price = { $gte: clientFilter.minPrice };
    if (clientFilter.maxPrice)
      f.price = { ...f.price, $lte: clientFilter.maxPrice };
  }
  if (clientSort) o.sort = { [clientSort.value]: clientSort.order };

  return getProducts(f, projection, o).catch((err) => {
    throw new Error(`Failed to get products: ${err.message}`);
  });
};

export default { createProduct, getProductById, getProducts };
