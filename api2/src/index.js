require("dotenv").config();
const express = require("express");
const db = require("./db");
const { ApolloServer, gql } = require("apollo-server-express");
const models = require("./models");
const port = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);
let notes = [
  { id: "1", content: "note1", author: "Adam" },
  { id: "2", content: "note2", author: "Bob" },
  { id: "3", content: "note3", author: "Candy" },
];
const typeDefs = gql`
  type Query {
    hello: String!
    notes: [Note!]!
    note(id: ID): Note!
  }
  type Note {
    id: ID!
    content: String!
    author: String!
  }
  type Mutation {
    newNote(content: String!): Note!
  }
`;
const resolvers = {
  Query: {
    hello: () => "Hello World!",
    notes: async () => {
      return await models.Note.find();
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    },
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: "Nan",
      });
    },
  },
};
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then((res) => {
  server.applyMiddleware({ app, path: "/api" });
  app.listen({ port: port }, () => console.log("server start!"));
});
