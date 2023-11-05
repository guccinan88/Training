const models = require("../models");
module.exports = {
  notes: async (parent, args) => {
    return await models.Note.find();
  },
  note: async (parent, args) => {
    return await models.Note.findById(args.id);
  },
};
