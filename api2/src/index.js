require("dotenv").config();
const express = require("express");
const db = require("./db");
const { ApolloServer, gql } = require("apollo-server-express");
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
    notes: () => notes,
    note: (parent, args) => {
      return notes.find((note) => note.id === args.id);
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: "Nan",
      };
      notes.push(noteValue);
      return noteValue;
    },
  },
};
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then((res) => {
  server.applyMiddleware({ app, path: "/api" });
  app.listen({ port: port }, () => console.log("server start!"));
});
