const mongoose = require("mongoose");

const connectDB = async (db_url, db_name) => {
  try {
    const options = {
      dbName: db_name,
    };
    await mongoose.connect(db_url, options);
    console.log("DB Connection Successfull");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
