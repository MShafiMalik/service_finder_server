const sellerService = require("../services/sellerService");
const { constructResponse } = require("../utils/utility");
const SellerService = new sellerService();

class CategoryController {
  static getOne = async (req, res) => {
    const { user_id } = req.body;
    const responseData = await SellerService.getOne(user_id);
    return constructResponse(res, responseData);
  };

  static getSellerDetail = async (req, res) => {
    const responseData = await SellerService.getSellerDetail(req.user);
    return constructResponse(res, responseData);
  };

  static busy = async (req, res) => {
    const { busy_date } = req.body;
    const responseData = await SellerService.busy(req.user, busy_date);
    return constructResponse(res, responseData);
  };
}

module.exports = CategoryController;
