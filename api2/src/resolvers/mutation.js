const models = require("../models");
module.exports = {
  newNote: async (parent, args) => {
    return await models.Note.create({
      content: args.content,
      author: "Nan Scott",
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
};
