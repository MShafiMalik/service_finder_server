const mongoose = require("mongoose");

const heroSliderSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

const HeroSliderModel = mongoose.model(
  "HeroSlider",
  heroSliderSchema,
  "hero_sliders"
);

module.exports = HeroSliderModel;
