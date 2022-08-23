const BookingModel = require("../database/models/bookings");
const BuyerReviewModel = require("../database/models/buyer_reviews");
const UserModel = require("../database/models/users");
const { HTTP_STATUS, ROLE_TYPES } = require("../utils/constants");
const {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
} = require("../utils/utility");

class BuyerReviewService {
  async add(
    user,
    seller_user_id,
    booking_id,
    service_id,
    rating,
    review,
    image
  ) {
    if (user.role !== ROLE_TYPES.BUYER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Buyer Can Add Review!"
      );
    }
    const db_seller_user = await UserModel.findById(seller_user_id);
    if (db_seller_user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Receive Review!"
      );
    }
    const is_duplicate = await BuyerReviewModel.find({
      seller_user: seller_user_id,
      buyer_user: user._id,
      booking: booking_id,
    });
    if (is_duplicate.length > 0) {
      return errorResponse(HTTP_STATUS.CONFLICT, "This Review Already Added!");
    }
    const booking = await BookingModel.findOne({
      _id: booking_id,
      seller_user: seller_user_id,
      buyer_user: user._id,
    });
    if (!booking) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "No Booking Found!");
    }
    const buyer_review = new BuyerReviewModel({
      seller_user: seller_user_id,
      buyer_user: user._id,
      booking: booking_id,
      service: service_id,
      rating: rating,
      review: review,
      image: image,
    });
    await buyer_review.save();
    if (buyer_review) {
      return successResponse(
        buyer_review,
        HTTP_STATUS.OK,
        "Review Added Successfully!"
      );
    } else {
      return internalServerErrorResponse();
    }
  }

  async get_all(user) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Only Seller Can Have Review!"
      );
    }
    const buyer_reviews = await BuyerReviewModel.find({
      seller_user: user._id,
    })
      .populate({
        path: "buyer_user",
        model: "User",
        select: "-password -__v",
      })
      .populate({
        path: "seller_user",
        model: "User",
        select: "-password -__v",
      })
      .populate({
        path: "booking",
        model: "Booking",
        select: "-__v",
      });
    return successResponse(
      buyer_reviews,
      HTTP_STATUS.OK,
      "Review Added Successfully!"
    );
  }
}

module.exports = BuyerReviewService;
