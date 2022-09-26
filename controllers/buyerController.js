const buyerService = require("../services/buyerService");
const BuyerService = new buyerService();
const { constructResponse } = require("../utils/utility");

class BuyerController {
  static getOne = async (req, res) => {
    const { user_id } = req.body;
    const responseData = await BuyerService.getOne(user_id);
    return constructResponse(res, responseData);
  };

  static getAll = async (_req, res) => {
    const responseData = await BuyerService.getAll();
    return constructResponse(res, responseData);
  };

  static block = async (req, res) => {
    const { user_id } = req.body;
    const responseData = await BuyerService.block(user_id);
    return constructResponse(res, responseData);
  };

  static unblock = async (req, res) => {
    const { user_id } = req.body;
    const responseData = await BuyerService.unblock(user_id);
    return constructResponse(res, responseData);
  };
}

module.exports = BuyerController;
