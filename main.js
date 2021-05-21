import express from "express";
import morgan from "morgan";
import "./db.js";
import graphql from "./graphql/graphql.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(morgan("dev"));

app.use("/graphql", graphql(true));

app.use((req, res, next) => {
  const error = {
    code: 501,
    name: "ROUTE_NOT_IMPLEMENTED",
    message: `${req.method} on ${req.originalUrl} not implemented`,
  };
  next(error);
});

app.use((err, req, res, next) => {
  let error;
  if (!err.code) {
    error = {
      code: 500,
      name: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    };
  } else error = err;
  res.status(error.code).json(error);
});

app.listen(PORT, () => `Server is listening on port ${PORT}`);


