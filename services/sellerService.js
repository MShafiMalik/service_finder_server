const SellerModel = require("../database/models/sellers");
const { HTTP_STATUS } = require("../utils/constants");
const { successResponse, errorResponse } = require("../utils/utility");

class SellerService {
  async add(user_id, address, description) {
    if (!user_id || !address || !description) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "All Fields Are Required!");
    }
    const old_seller = await SellerModel.findOne({ user_id: user_id });
    if (old_seller) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Seller Already Added!");
    }
    const seller = new SellerModel({
      user_id: user_id,
      address: address,
      description: description,
    });
    await seller.save();
    return successResponse(
      seller,
      HTTP_STATUS.OK,
      "Seller Added Successfully!"
    );
  }
}

module.exports = SellerService;
