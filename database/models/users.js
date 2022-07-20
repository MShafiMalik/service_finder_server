const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  image: { type: String, required: false, trim: true },
  phone: { type: String, required: false, trim: true },
  city: { type: String, required: false, trim: true },
  state: { type: String, required: false, trim: true },
  country: { type: String, required: false, trim: true },
  description: { type: String, required: false, trim: true },
  is_active: { type: Boolean, required: true },
  activation_key: { type: Number, required: true },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
