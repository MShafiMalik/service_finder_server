const BookingModel = require("../database/models/bookings");
const {
  HTTP_STATUS,
  BOOKING_STATUS,
  ROLE_TYPES,
} = require("../utils/constants");
const {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
} = require("../utils/utility");

class BookingService {
  async create(req) {
    if (req.user.role !== ROLE_TYPES.BUYER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Buyer Can Create Booking!"
      );
    }
    const { seller_user_id, service_id, work_start_datetime } = req.body;
    const is_duplicate = await BookingModel.find({
      seller_user: seller_user_id,
      buyer_user: req.user._id,
      service: service_id,
      status: {
        $nin: [
          BOOKING_STATUS.COMPLETED,
          BOOKING_STATUS.DENIED,
          BOOKING_STATUS.CANCELLED,
        ],
      },
    });
    if (is_duplicate.length > 0) {
      return errorResponse(
        HTTP_STATUS.CONFLICT,
        "This Booking Already Created!"
      );
    }
    const booking = new BookingModel({
      seller_user: seller_user_id,
      buyer_user: req.user._id,
      service: service_id,
      work_start_datetime: work_start_datetime,
    });
    await booking.save();
    if (booking) {
      return successResponse(
        booking,
        HTTP_STATUS.OK,
        "Booking Created Successfully!"
      );
    } else {
      return internalServerErrorResponse();
    }
  }

  async accept(user, booking_id) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Accept Booking!"
      );
    }
    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Not Found!");
    }
    if (booking.status !== BOOKING_STATUS.CREATED) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Invalid Booking!");
    }
    booking.status = BOOKING_STATUS.ACCEPTED;
    await booking.save();
    return successResponse(
      booking,
      HTTP_STATUS.OK,
      "Booking Accepted Successfully!"
    );
  }

  async deny(user, booking_id) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Deny Booking!"
      );
    }
    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Not Found!");
    }
    if (booking.status !== BOOKING_STATUS.CREATED) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Invalid Booking!");
    }
    booking.status = BOOKING_STATUS.DENIED;
    await booking.save();
    return successResponse(
      booking,
      HTTP_STATUS.OK,
      "Booking Denied Successfully!"
    );
  }

  async submit(user, booking_id) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Submit Booking!"
      );
    }
    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Not Found!");
    }
    if (booking.status !== BOOKING_STATUS.ACCEPTED) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Invalid Booking!");
    }
    booking.status = BOOKING_STATUS.SUBMITED;
    booking.work_end_datetime = new Date();
    await booking.save();
    return successResponse(
      booking,
      HTTP_STATUS.OK,
      "Booking Submited Successfully!"
    );
  }

  async complete(user, booking_id) {
    if (user.role !== ROLE_TYPES.BUYER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Buyer Can Accept Booking!"
      );
    }
    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Not Found!");
    }
    if (booking.status !== BOOKING_STATUS.SUBMITED) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Invalid Booking!");
    }
    booking.status = BOOKING_STATUS.COMPLETED;
    await booking.save();
    return successResponse(
      booking,
      HTTP_STATUS.OK,
      "Booking Completed Successfully!"
    );
  }

  async dispute(user, booking_id) {
    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Not Found!");
    }
    if (
      booking.status !== BOOKING_STATUS.SUBMITED &&
      booking.status !== BOOKING_STATUS.ACCEPTED
    ) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Invalid Booking!");
    }
    if (user.role === ROLE_TYPES.BUYER) {
      booking.status = BOOKING_STATUS.DISPUTED_BY_BUYER;
    } else if (user.role === ROLE_TYPES.SELLER) {
      booking.status = BOOKING_STATUS.DISPUTED_BY_SELLER;
    } else {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Buyer Or Seller Can Dispute Booking!"
      );
    }
    await booking.save();
    return successResponse(
      booking,
      HTTP_STATUS.OK,
      "Booking Disputed Successfully!"
    );
  }

  async dispute_reject(user, booking_id) {
    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Not Found!");
    }
    if (
      booking.status !== BOOKING_STATUS.DISPUTED_BY_BUYER &&
      booking.status !== BOOKING_STATUS.DISPUTED_BY_SELLER
    ) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Invalid Booking!");
    }
    if (
      user.role === ROLE_TYPES.BUYER &&
      booking.status === BOOKING_STATUS.DISPUTED_BY_SELLER
    ) {
      booking.status = BOOKING_STATUS.ACCEPTED;
    } else if (
      user.role === ROLE_TYPES.SELLER &&
      booking.status === BOOKING_STATUS.DISPUTED_BY_BUYER
    ) {
      booking.status = BOOKING_STATUS.ACCEPTED;
    } else {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized Buyer Or Seller!"
      );
    }
    await booking.save();
    return successResponse(
      booking,
      HTTP_STATUS.OK,
      "Booking Dispute Rejected Successfully!"
    );
  }

  async dispute_accept(user, booking_id) {
    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Not Found!");
    }
    if (
      booking.status !== BOOKING_STATUS.DISPUTED_BY_BUYER &&
      booking.status !== BOOKING_STATUS.DISPUTED_BY_SELLER
    ) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Invalid Booking!");
    }
    if (
      user.role === ROLE_TYPES.BUYER &&
      booking.status === BOOKING_STATUS.DISPUTED_BY_SELLER
    ) {
      booking.status = BOOKING_STATUS.CANCELLED;
    } else if (
      user.role === ROLE_TYPES.SELLER &&
      booking.status === BOOKING_STATUS.DISPUTED_BY_BUYER
    ) {
      booking.status = BOOKING_STATUS.CANCELLED;
    } else {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized Buyer Or Seller!"
      );
    }
    await booking.save();
    return successResponse(
      booking,
      HTTP_STATUS.OK,
      "Booking Cancelled Successfully!"
    );
  }

  async get_pending_all(user) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Get Bookings!"
      );
    }
    const bookings = await BookingModel.find({
      seller_user: user._id,
      status: BOOKING_STATUS.CREATED,
    })
      .populate({
        path: "seller_user",
        Model: "User",
        select: "-__v",
      })
      .populate({
        path: "buyer_user",
        Model: "User",
        select: "-__v",
      })
      .populate({
        path: "service",
        Model: "Service",
        select: "-__v",
      });
    return successResponse(bookings, HTTP_STATUS.OK);
  }

  async get_active_all(user) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Get Bookings!"
      );
    }
    const bookings = await BookingModel.find({
      seller_user: user._id,
      status: BOOKING_STATUS.ACCEPTED,
    })
      .populate({
        path: "seller_user",
        Model: "User",
        select: "-__v",
      })
      .populate({
        path: "buyer_user",
        Model: "User",
        select: "-__v",
      })
      .populate({
        path: "service",
        Model: "Service",
        select: "-__v",
      });
    return successResponse(bookings, HTTP_STATUS.OK);
  }

  async get_completed_all(user) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Get Bookings!"
      );
    }
    const bookings = await BookingModel.find({
      seller_user: user._id,
      status: BOOKING_STATUS.COMPLETED,
    })
      .populate({
        path: "seller_user",
        Model: "User",
        select: "-__v",
      })
      .populate({
        path: "buyer_user",
        Model: "User",
        select: "-__v",
      })
      .populate({
        path: "service",
        Model: "Service",
        select: "-__v",
      });
    return successResponse(bookings, HTTP_STATUS.OK);
  }

  async get_cancelled_all(user) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Get Bookings!"
      );
    }
    const bookings = await BookingModel.find({
      seller_user: user._id,
      status: BOOKING_STATUS.CANCELLED,
    })
      .populate({
        path: "seller_user",
        Model: "User",
        select: "-__v",
      })
      .populate({
        path: "buyer_user",
        Model: "User",
        select: "-__v",
      })
      .populate({
        path: "service",
        Model: "Service",
        select: "-__v",
      });
    return successResponse(bookings, HTTP_STATUS.OK);
  }
}

module.exports = BookingService;
