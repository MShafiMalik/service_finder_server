const sellerService = require("../services/sellerService");
const SellerService = new sellerService();
const { constructResponse } = require("../utils/utility");

class SellerController {
  static add = async (req, res) => {
    const { user_id, address, description } = req.body;
    const responseData = await SellerService.add(user_id, address, description);
    return constructResponse(res, responseData);
  };
}

module.exports = SellerController;
