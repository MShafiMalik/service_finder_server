const mongoose = require("mongoose");
const { ADMIN_OTP_STATUS } = require("../../utils/constants");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  image: { type: String, required: false, trim: true },
  activation_key: { type: Number, required: false },
  key_expire_time: { type: Date, default: Date.now },
  otp_status: {
    type: String,
    required: false,
    trim: true,
    default: ADMIN_OTP_STATUS.IDLE,
  },
});

const AdminModel = mongoose.model("Admin", adminSchema, "admins");

module.exports = AdminModel;
