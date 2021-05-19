import productService from "../services/productService.js";
import commentService from "../services/commentService.js";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql-schema.js";

const flatObj = (obj) => {
  const keys = Object.keys(obj);
  let result = {};
  let isFlat = true;
  keys.forEach((x) => {
    if (typeof obj[x] !== "object") result = { ...result, [x]: obj[x] };
    else if (Object.keys(obj[x]).length === 0) result = { ...result, [x]: 1 };
    else {
      isFlat = false;
      Object.keys(obj[x]).forEach((y) => {
        result = { ...result, [x + "." + y]: obj[x][y] };
      });
    }
  });
  return isFlat ? result : flatObj(result);
};

const getFields = (selectionSet, obj) => {
  selectionSet.selections.forEach((x) => {
    obj[x.name.value] = {};
    x.selectionSet && getFields(x.selectionSet, obj[x.name.value]);
  });
};

const getSelection = (info) => {
  const selectionSets = info.fieldNodes.map((x) => x.selectionSet);
  const selectionObj = {};
  selectionSets.forEach((selectionSet) =>
    getFields(selectionSet, selectionObj)
  );
  return flatObj(selectionObj);
};

const graphql = (enableGraphiQL) => {
  const rootValue = {
    products: (args, ctx, info) =>
      productService.getProducts(
        {
          clientFilter: args.filter,
          clientSort: args.sort,
        },
        getSelection(info)
      ),
    product: (args, ctx, info) => productService.getProductById(
      args.id,
      getSelection(info)
    ),
    /**
     *
     * @param args
     * @param ctx
     * @param info
     */
    createProduct: (args, ctx, info) =>
      productService.createProduct(
        args.createProductInput,
        getSelection(info)
      ),
    /**
     *
     * @param args
     * @param ctx
     * @param info
     */
    createComment: (args, ctx, info) => commentService.createComment(
      args,
      getSelection(info)
    ),
  };
  return graphqlHTTP({
    schema,
    rootValue,
    graphiql: !!enableGraphiQL,
  });
};

export default graphql;
