const UserModel = require("../database/models/users");
const { HTTP_STATUS, ROLE_TYPES } = require("../utils/constants");
const { successResponse, errorResponse } = require("../utils/utility");

class BuyerService {
  async getAll() {
    const buyers = await UserModel.find({ role: ROLE_TYPES.BUYER }).select(
      "-__v -password -activation_key -created_at -key_expire_time"
    );
    return successResponse(buyers, HTTP_STATUS.OK, "");
  }

  async getOne(user_id) {
    const user = await UserModel.findOne({
      _id: user_id,
      role: ROLE_TYPES.BUYER,
    }).select("-__v -password -activation_key -created_at -key_expire_time");
    if (user.role !== ROLE_TYPES.BUYER) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid Buyer!");
    }
    return successResponse(user, HTTP_STATUS.OK, "");
  }

  async block(user_id) {
    const user = await UserModel.findById(user_id);
    if (user.role !== ROLE_TYPES.BUYER) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid Buyer!");
    }
    user.is_blocked = true;
    await user.save();
    return successResponse("", HTTP_STATUS.OK, "Buyer Blocked Successfully!");
  }

  async unblock(user_id) {
    const user = await UserModel.findById(user_id);
    if (user.role !== ROLE_TYPES.BUYER) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid Buyer!");
    }
    user.is_blocked = false;
    await user.save();
    return successResponse("", HTTP_STATUS.OK, "Buyer Unblocked Successfully!");
  }
}

module.exports = BuyerService;
