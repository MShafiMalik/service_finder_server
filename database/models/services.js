const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  seller_id: { type: Number, required: true, trim: true },
  category_id: { type: Number, required: true, trim: true },
});

const ServiceModel = mongoose.model("services", serviceSchema);

module.exports = ServiceModel;
