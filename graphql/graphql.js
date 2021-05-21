import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "graphql-tools";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphql = (enableGraphiQL) => {
  return graphqlHTTP({
    schema,
    graphiql: !!enableGraphiQL,
  });
};

export default graphql;
