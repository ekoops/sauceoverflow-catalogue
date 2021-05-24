import productService from "../services/productService.js";
import commentService from "../services/commentService.js";

/**
 * Creates an object defining which fields have to be projected
 * @param info {Object}
 * @returns  {Object<string,number>}
 *
 */
const getProjection = (info) => {
  const fieldsArray = info.fieldNodes.flatMap((x) =>
    x.selectionSet.selections.map((y) => y.name.value)
  );
  let projection = {};
  fieldsArray.forEach((x) => {
    projection[x] = 1;
  });
  return projection;
};

const resolvers = {
  Query: {
    products: (_, { filter, sort }, ctx, info) =>
      productService.getProducts(
        {
          clientFilter: filter,
          clientSort: sort,
        },
        getProjection(info)
      ),
    product: (_, { id }, ctx, info) =>
      productService.getProductById(id, getProjection(info)),
  },
  Mutation: {
    createProduct: (_, { createProductInput }) =>
      productService.createProduct(createProductInput),
    createComment: (_, { createCommentInput, productId }) =>
      commentService.createComment(productId, createCommentInput),
  },
  Product: {
    comments: (product, { last }, ctx, info) =>
      commentService.getCommentsByProductId(
        product._id,
        last,
        getProjection(info)
      ),
  },
};

export default resolvers;
