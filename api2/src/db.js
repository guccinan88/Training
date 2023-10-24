const mongoose = require("mongoose");

module.exports = {
  connect: (DB_HOST) => {
    mongoose.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection
      .on("open", (msg) => console.log("db open success:", msg))
      .on("error", (err) => console.log("error:", err));
  },
  close: () => {
    mongoose.connect.close();
  },
};
