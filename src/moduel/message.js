const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  seen: {
   type:Boolean,
   default:false
},
  user: String
}, { timestamps: true });

const message = mongoose.model("Message", messageSchema);
module.exports = message



