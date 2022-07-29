const mongoose = require("mongoose");
const { SELLER_STATUS } = require("../../utils/constants");

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
  key_expire_time: { type: Date, default: Date.now },
  status: { type: String, default: SELLER_STATUS.IDLE },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

const UserModel = mongoose.model("User", userSchema, "users");

module.exports = UserModel;
