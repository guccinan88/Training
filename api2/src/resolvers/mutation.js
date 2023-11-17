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
      author: new mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }, { user }) => {
    /*try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }*/
    if (!user) {
      throw new AuthenticationError("You must be signed on a delete");
    }
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw new AuthenticationError("沒有刪除權限!");
    }
    try {
      await note.remove();
      return true;
    } catch (err) {
      console.log("err:", err);
      return false;
    }
  },
  updateNote: async (parent, { content, id }) => {
    if (!user) {
      throw new AuthenticationError("必須登入!");
    }
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("沒有更新權限!");
    }
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
  toggleFavorite: async (parent, { id }, { user }) => {
    if (!user) {
      throw new AuthenticationError("使用者未登入");
    }
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);
    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: new mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          new: true,
        }
      );
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: new mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: 1,
          },
        },
        {
          new: true,
        }
      );
    }
  },
};
