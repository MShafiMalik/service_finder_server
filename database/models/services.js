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
    mon:
      {
        start: { type: String, required: true, trim: true },
        end: { type: String, required: true, trim: true },
      } | { type: String, required: true, trim: true },
    tue:
      {
        start: { type: String, required: true, trim: true },
        end: { type: String, required: true, trim: true },
      } | { type: String, required: true, trim: true },
    wed:
      {
        start: { type: String, required: true, trim: true },
        end: { type: String, required: true, trim: true },
      } | { type: String, required: true, trim: true },
    thu:
      {
        start: { type: String, required: true, trim: true },
        end: { type: String, required: true, trim: true },
      } | { type: String, required: true, trim: true },
    fri:
      {
        start: { type: String, required: true, trim: true },
        end: { type: String, required: true, trim: true },
      } | { type: String, required: true, trim: true },
    sat:
      {
        start: { type: String, required: true, trim: true },
        end: { type: String, required: true, trim: true },
      } | { type: String, required: true, trim: true },
    sun:
      {
        start: { type: String, required: true, trim: true },
        end: { type: String, required: true, trim: true },
      } | { type: String, required: true, trim: true },
  },
});

const ServiceModel = mongoose.model("services", serviceSchema);

module.exports = ServiceModel;
