import express from "express";
import morgan from "morgan";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql-schema.js";
import commentService from "./services/commentService.js";
import productService from "./services/productService.js";

import "./db.js";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(morgan("dev"));

const rootValue = {
  products: () => {},
  product: () => {},
  /**
   *
   * @param param {{productId: Number!, title: String!, body: String, stars: Number!}}
   */
  createProduct: param => productService.createProduct(param.createProductInput),
  /**
   *
   * @param param {{productId: Number!, title: String!, body: String, stars: Number!}}
   */
  createComment: param => commentService.createComment(param),
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.use((req, res, next) => {
  const error = {
    code: 501,
    name: "ROUTE_NOT_IMPLEMENTED",
    message: `${req.method} su ${req.originalUrl} non implementata`,
  };
  next(error);
});

app.use((err, req, res, next) => {
  let error;
  if (!err.code) {
    error = {
      code: 500,
      name: "INTERNAL_SERVER_ERROR",
      message: "Errore interno al server",
    };
  } else error = err;
  res.status(error.code).json(error);
});

app.listen(PORT);


