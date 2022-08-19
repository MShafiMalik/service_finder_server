const mongoose = require("mongoose");

const busyUserSchema = new mongoose.Schema({
  seller_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  busy_date: { type: Date, required: true },
});

const BusyUserModel = mongoose.model("BusyUser", busyUserSchema, "busy_users");

module.exports = BusyUserModel;
