const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    const mongooseUrl = process.env.MONGO_URI
  try {
    await mongoose.connect(mongooseUrl);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("DB Error ❌", error);
    process.exit(1)
  }
};

module.exports = connectDB;