const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

const CategoryModel = mongoose.model("Category", categorySchema, "categories");

module.exports = CategoryModel;
