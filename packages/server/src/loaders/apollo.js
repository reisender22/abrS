const polka = require("./polka");
const typeDefs = require("../api/typeDefs");
const resolvers = require("../api/resolvers");
const { ApolloServer } = require("apollo-server-express");

const app = polka();

module.exports = function apollo() {
  const apollo = new ApolloServer({ typeDefs, resolvers });

  apollo.applyMiddleware({ app, path: "/graphql" });
};
