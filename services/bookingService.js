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

const get_bookings = async (user, status) => {
  let query_condition;
  if (user.role === ROLE_TYPES.SELLER) {
    query_condition = {
      seller_user: user._id,
      status: status,
    };
  } else if (user.role === ROLE_TYPES.BUYER) {
    query_condition = {
      buyer_user: user._id,
      status: status,
    };
  } else {
    return {
      success: false,
      data: "",
    };
  }
  const bookings = await BookingModel.find(query_condition)
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

  return { success: true, data: bookings };
};

class BookingService {
  async create(req) {
    if (req.user.role !== ROLE_TYPES.BUYER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Buyer Can Create Booking!"
      );
    }
    const { seller_user_id, service_id, work_start_date, work_start_time } =
      req.body;
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
      work_start_datetime: new Date(work_start_date + " " + work_start_time),
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
    booking.status = BOOKING_STATUS.SUBMITTED;
    booking.work_end_datetime = new Date();
    await booking.save();
    return successResponse(
      booking,
      HTTP_STATUS.OK,
      "Booking Submitted Successfully!"
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
    if (booking.status !== BOOKING_STATUS.SUBMITTED) {
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
      booking.status !== BOOKING_STATUS.SUBMITTED &&
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

  async get_all() {
    const bookings = await BookingModel.find({})
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

  async cancel(booking_id) {
    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Not Found!");
    }
    if (
      booking.status === BOOKING_STATUS.CANCELLED ||
      booking.status === BOOKING_STATUS.COMPLETED
    ) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Invalid Booking!");
    }
    booking.status = BOOKING_STATUS.CANCELLED;
    await booking.save();
    return successResponse(
      "",
      HTTP_STATUS.OK,
      "Booking Cancelled Successfully!"
    );
  }

  async get_pending_all(user) {
    const bookings = await get_bookings(user, BOOKING_STATUS.CREATED);
    if (bookings.success === false) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Or Buyer Can Get Bookings!"
      );
    } else {
      return successResponse(bookings.data, HTTP_STATUS.OK);
    }
  }

  async get_active_all(user) {
    const bookings = await get_bookings(user, BOOKING_STATUS.ACCEPTED);
    if (bookings.success === false) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Or Buyer Can Get Bookings!"
      );
    } else {
      return successResponse(bookings.data, HTTP_STATUS.OK);
    }
  }

  async get_active_all_for_buyer(seller_user_id) {
    const bookings = await BookingModel.find({
      seller_user: seller_user_id,
      status: BOOKING_STATUS.ACCEPTED,
    });
    return successResponse(bookings, HTTP_STATUS.OK);
  }

  async get_submitted_all(user) {
    const bookings = await get_bookings(user, BOOKING_STATUS.SUBMITTED);
    if (bookings.success === false) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Or Buyer Can Get Bookings!"
      );
    } else {
      return successResponse(bookings.data, HTTP_STATUS.OK);
    }
  }

  async get_completed_all(user) {
    const bookings = await get_bookings(user, BOOKING_STATUS.COMPLETED);
    if (bookings.success === false) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Or Buyer Can Get Bookings!"
      );
    } else {
      return successResponse(bookings.data, HTTP_STATUS.OK);
    }
  }

  async get_cancelled_all(user) {
    const bookings = await get_bookings(user, BOOKING_STATUS.CANCELLED);
    if (bookings.success === false) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Or Buyer Can Get Bookings!"
      );
    } else {
      return successResponse(bookings.data, HTTP_STATUS.OK);
    }
  }
}

module.exports = BookingService;
