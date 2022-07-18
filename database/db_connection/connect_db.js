const mongoose = require("mongoose");

const connectDB = async (db_url) => {
  try {
    await mongoose.connect(db_url);
    console.log("DB Connection Successfull");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
