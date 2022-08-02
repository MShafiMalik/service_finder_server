const mongoose = require("mongoose");

const buyerReviewSchema = new mongoose.Schema({
  seller_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  buyer_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Booking",
  },
  rating: { type: Number, required: true, min: 0, max: 5 },
  review: { type: String, required: true, trim: true },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

const BuyerReviewModel = mongoose.model(
  "BuyerReview",
  buyerReviewSchema,
  "buyer_reviews"
);

module.exports = BuyerReviewModel;
