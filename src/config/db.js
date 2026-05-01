const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://suresh:joshi123@cluster0.sjr9cxj.mongodb.net/");
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("DB Error ❌", error);
  }
};

module.exports = connectDB;