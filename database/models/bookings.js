const mongoose = require("mongoose");
const { BOOKING_STATUS } = require("../../utils/constants");

const bookingSchema = new mongoose.Schema({
  seller_user_id: { type: String, required: true, trim: true },
  buyer_user_id: { type: String, required: true, trim: true },
  service_id: { type: String, required: true, trim: true },
  work_start_datetime: { type: Date, required: true, trim: true },
  work_end_datetime: { type: Date, required: false, trim: true },
  status: {
    type: String,
    required: true,
    trim: true,
    default: BOOKING_STATUS.CREATED,
  },
  created_at: { type: Date, required: true, trim: true, default: Date.now() },
});

const BookingModel = mongoose.model("bookings", bookingSchema);

module.exports = BookingModel;
