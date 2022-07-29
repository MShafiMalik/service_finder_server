const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  service_id: { type: Number, required: true, trim: true },
  basic_pkg_name: { type: String, required: true, trim: true },
  basic_pkg_description: { type: String, required: true, trim: true },
  basic_pkg_price: { type: Number, required: true, trim: true },
  standard_pkg_name: { type: String, required: true, trim: true },
  standard_pkg_description: { type: String, required: true, trim: true },
  standard_pkg_price: { type: Number, required: true, trim: true },
  premium_pkg_name: { type: String, required: true, trim: true },
  premium_pkg_description: { type: String, required: true, trim: true },
  premium_pkg_price: { type: Number, required: true, trim: true },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

const PackageModel = mongoose.model("packages", packageSchema);

module.exports = PackageModel;
