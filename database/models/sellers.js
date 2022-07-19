const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

const SellerModel = mongoose.model("sellers", sellerSchema);

module.exports = SellerModel;
