import Product from "../models/product.js";
import { promisify } from "util";

const createProduct = ({ name, description, price, category }) => {
  const createProduct = promisify(Product.create.bind(Product));
  return createProduct({
    name,
    description,
    price,
    category,
  }).catch(() => throw new Error("Failed to create a product"));
};

const getProductById = (productId, projection) => {
  const findProductById = promisify(Product.findById.bind(Product));
  return findProductById(productId, projection).catch(
    () => throw new Error(`Failed to get the product(${productId})`)
  );
};

const getProducts = ({ clientFilter, clientSort }, projection) => {
  const getProducts = promisify(Product.find.bind(Product));

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

  return getProducts(f, projection, o).catch(
    () => throw new Error("Failed to get products")
  );
};

export default { createProduct, getProductById, getProducts };
