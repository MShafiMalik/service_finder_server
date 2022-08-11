const UserModel = require("../database/models/users");
const { HTTP_STATUS } = require("../utils/constants");
const { successResponse, errorResponse } = require("../utils/utility");

class CategoryService {
  async getOne(user_id) {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Seller Not Found!");
    }
    return successResponse(user, HTTP_STATUS.OK, "");
  }
}

module.exports = CategoryService;
