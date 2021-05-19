import Product from "../models/product.js";
import {promisify} from "util";

// TODO projection
const createProduct = async ({name, description, price, category}, selection) => {
  const createProduct = promisify(Product.create.bind(Product));
  return await createProduct({
    name,
    description,
    price,
    category,
    comments: [],
    stars: 0,
  });
};

const getProductById = async (productId, selection) => {
  const findProductById = promisify(Product.findById.bind(Product));
  try {
    return await findProductById(productId, selection);
  }
  catch (e) {
    console.error(e);
  }
}

const getProducts = async ({clientFilter, clientSort}, selection) => {
  const getProducts = promisify(Product.find.bind(Product));

  const f = {};
  const o = {};
  if (clientFilter) {
    if (clientFilter.categories) f.category = {$in: clientFilter.categories};
    if (clientFilter.minStars) f.stars = {$gte: clientFilter.minStars};
    if (clientFilter.minPrice) f.price = {$gte:  clientFilter.minPrice};
    if (clientFilter.maxPrice) f.price = {...f.price, $lte: clientFilter.maxPrice};
  }
  if (clientSort) o.sort = {[clientSort.value]: clientSort.order};
  try {
    return await getProducts(f, selection, o);
  }
  catch (e) {
    console.error(e);
  }
}

export default { createProduct, getProductById, getProducts  };
