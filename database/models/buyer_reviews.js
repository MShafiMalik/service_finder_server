const mongoose = require("mongoose");

const buyerReviewSchema = new mongoose.Schema({
  seller_user_id: { type: String, required: true, trim: true },
  buyer_user_id: { type: String, required: true, trim: true },
  booking_id: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  review: { type: String, required: true, trim: true },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

const BuyerReviewModel = mongoose.model("buyer_reviews", buyerReviewSchema);

module.exports = BuyerReviewModel;
