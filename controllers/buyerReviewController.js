const buyerReviewService = require("../services/buyerReviewService");
const BuyerReviewService = new buyerReviewService();
const { constructResponse } = require("../utils/utility");

class CategoryController {
  static add = async (req, res) => {
    const { seller_user_id, booking_id, service_id, rating, review, image } =
      req.body;
    const responseData = await BuyerReviewService.add(
      req.user,
      seller_user_id,
      booking_id,
      service_id,
      rating,
      review,
      image
    );
    return constructResponse(res, responseData);
  };

  static get_all = async (req, res) => {
    const responseData = await BuyerReviewService.get_all(req.user);
    return constructResponse(res, responseData);
  };
}

module.exports = CategoryController;
