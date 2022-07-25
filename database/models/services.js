const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  user_id: { type: String, required: true, trim: true },
  category_id: { type: String, required: true, trim: true },
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
  weekly_schedule: {
    mon: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
    },
    tue: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
    },
    wed: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
    },
    thu: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
    },
    fri: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
    },
    sat: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
    },
    sun: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
    },
  },
});

const ServiceModel = mongoose.model("services", serviceSchema);

module.exports = ServiceModel;
