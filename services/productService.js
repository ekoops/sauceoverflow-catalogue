import Product from "../models/product.js";
import { promisify } from "util";
// { name, description, price, category }
const createProduct = async (param) => {
  const promisifiedCreateProduct = promisify(Product.create.bind(Product));
  console.log(param);
  return await promisifiedCreateProduct({
    // name,
    // description,
    // price,
    // category,
    ...param,
    comments: [],
    stars: 0,
  });
};

export default { createProduct };
