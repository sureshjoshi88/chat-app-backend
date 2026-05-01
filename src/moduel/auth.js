const mongoose  = require("mongoose");


const authSchemas = new mongoose.Schema( {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true })
const authSchema = mongoose.model("Auth",authSchemas);
module.exports = authSchema;