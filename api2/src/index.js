require("dotenv").config();
const express = require("express");
const db = require("./db");
const { ApolloServer, gql } = require("apollo-server-express");
const models = require("./models");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const cors = require("cors");
const port = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);

const app = express();
app.use(helmet());
app.use(cors());
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);
    return { models, user };
  },
});

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Session invalid");
    }
  }
};

server.start().then((res) => {
  server.applyMiddleware({ app, path: "/api" });
  app.listen({ port: port }, () => console.log("server start!"));
});
