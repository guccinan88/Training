require("dotenv").config();
const express = require("express");
const db = require("./db");
const { ApolloServer, gql } = require("apollo-server-express");
const models = require("./models");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const port = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);
let notes = [
  { id: "1", content: "note1", author: "Adam" },
  { id: "2", content: "note2", author: "Bob" },
  { id: "3", content: "note3", author: "Candy" },
];

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return models;
  },
});
server.start().then((res) => {
  server.applyMiddleware({ app, path: "/api" });
  app.listen({ port: port }, () => console.log("server start!"));
});
