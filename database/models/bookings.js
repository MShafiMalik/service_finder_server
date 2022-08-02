const mongoose = require("mongoose");
const { BOOKING_STATUS } = require("../../utils/constants");

const bookingSchema = new mongoose.Schema({
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
  service: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Service",
  },
  work_start_datetime: { type: Date, required: true, trim: true },
  work_end_datetime: { type: Date, required: false, trim: true },
  status: {
    type: String,
    required: true,
    trim: true,
    default: BOOKING_STATUS.CREATED,
  },
  created_at: { type: Date, required: true, default: Date.now() },
});

const BookingModel = mongoose.model("Booking", bookingSchema, "bookings");

module.exports = BookingModel;
