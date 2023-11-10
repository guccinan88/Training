const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const models = require("../models");
const mongoose = require("mongoose");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");

module.exports = {
  newNote: async (parent, args, { user }) => {
    if (!user) {
      throw new AuthenticationError("必須登入才可建立!");
    }
    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }) => {
    try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, { content, id }) => {
    return await models.Note.findOneAndUpdate(
      { _id: id },
      { $set: { content } },
      { new: true }
    );
  },
  signUp: async (parent, { username, email, password }) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await models.User.create({
        username,
        email,
        password: hashed,
      });
      return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log("sign error:", err);
    }
  },
  signIn: async (parent, { username, email, password }) => {
    if (email) {
      (email = email.trim()).toLowerCase();
    }
    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      throw new AuthenticationError("Error SignIn Not Find User");
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError("Error SignIn Password Error");
    }
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  },
};
