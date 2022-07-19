const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  is_active: { type: Boolean, required: true },
  activation_key: { type: Number, required: true },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
