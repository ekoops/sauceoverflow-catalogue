import productService from "../services/productService.js";
import commentService from "../services/commentService.js";

const getProjection = (info) => {
  const fieldsArray = info.fieldNodes.flatMap((x) =>
    x.selectionSet.selections.map((y) => y.name.value)
  );
  return fieldsArray.reduce((acc, cur) => ({ ...acc, [cur]: 1 }), {});
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
    createComment: (_, { createCommentInput, productId }, ctx, info) =>
      commentService.createComment(
        productId,
        createCommentInput,
        getProjection(info)
      ),
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