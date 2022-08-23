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
  service: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "services",
  },
  rating: {
    seller_communication_level: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    service_as_described: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    average_rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  review: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

buyerReviewSchema.pre("save", function (next) {
  this.rating.average_rating = (
    (this.rating.seller_communication_level +
      this.rating.service_as_described) /
    2
  ).toFixed(1);
  next();
});

const BuyerReviewModel = mongoose.model(
  "BuyerReview",
  buyerReviewSchema,
  "buyer_reviews"
);

module.exports = BuyerReviewModel;
