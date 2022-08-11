const mongoose = require("mongoose");
const { SERVICE_STATUS } = require("../../utils/constants");

const serviceSchema = new mongoose.Schema({
  seller_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  latitude: { type: String, required: true, trim: true },
  longitude: { type: String, required: true, trim: true },
  radius: { type: Number, required: true, trim: true },
  packages: {
    basic: {
      name: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      price: { type: Number, required: true, trim: true },
    },
    standard: {
      name: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      price: { type: Number, required: true, trim: true },
    },
    premium: {
      name: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      price: { type: Number, required: true, trim: true },
    },
  },
  images: [{ type: String, required: true, trim: true }],
  status: {
    type: String,
    required: true,
    trim: true,
    default: SERVICE_STATUS.ACTIVE,
  },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

const ServiceModel = mongoose.model("Service", serviceSchema, "services");

module.exports = ServiceModel;
