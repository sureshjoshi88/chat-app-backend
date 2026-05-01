const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: String,
    user: String,
  },
  { timestamps: true }
);

const message = mongoose.model("Message", messageSchema);
module.exports = message