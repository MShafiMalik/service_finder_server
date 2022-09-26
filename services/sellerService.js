const { default: mongoose } = require("mongoose");
const BusyUserModel = require("../database/models/busyUsers");
const UserModel = require("../database/models/users");
const {
  HTTP_STATUS,
  SERVICE_STATUS,
  ROLE_TYPES,
} = require("../utils/constants");
const { successResponse, errorResponse } = require("../utils/utility");

const get_seller = async (user_id) => {
  const sellers = await UserModel.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: "buyer_reviews",
        as: "reviews",
        let: { user_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$seller_user", "$$user_id"] },
            },
          },
          {
            $lookup: {
              from: "users",
              as: "buyer",
              let: { user_id: "$buyer_user" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$user_id"] },
                  },
                },
              ],
            },
          },
          { $unwind: "$buyer" },
        ],
      },
    },
    {
      $lookup: {
        from: "services",
        as: "services",
        let: { user_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$seller_user", "$$user_id"] },
                  { $eq: ["$status", SERVICE_STATUS.ACTIVE] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "buyer_reviews",
              as: "reviews",
              let: { service_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$service", "$$service_id"] },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]).exec();
  return sellers.length > 0 ? sellers[0] : "";
};

class SellerService {
  async getOne(user_id) {
    const user = await UserModel.findOne({
      _id: user_id,
      role: ROLE_TYPES.SELLER,
    });
    if (!user) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Seller Not Found!");
    }

    const seller = await get_seller(user_id);
    return successResponse(seller, HTTP_STATUS.OK, "");
  }

  async getAll() {
    const sellers = await UserModel.aggregate([
      {
        $match: {
          role: ROLE_TYPES.SELLER,
        },
      },
      {
        $lookup: {
          from: "buyer_reviews",
          as: "reviews",
          let: { user_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$seller_user", "$$user_id"] },
              },
            },
            {
              $lookup: {
                from: "users",
                as: "buyer",
                let: { user_id: "$buyer_user" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$user_id"] },
                    },
                  },
                ],
              },
            },
            { $unwind: "$buyer" },
          ],
        },
      },
      {
        $lookup: {
          from: "services",
          as: "services",
          let: { user_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$seller_user", "$$user_id"] },
                    { $eq: ["$status", SERVICE_STATUS.ACTIVE] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "buyer_reviews",
                as: "reviews",
                let: { service_id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$service", "$$service_id"] },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]).exec();

    return successResponse(sellers, HTTP_STATUS.OK, "");
  }

  async getSellerDetail(user) {
    const seller = await get_seller(user._id);
    return successResponse(seller, HTTP_STATUS.OK, "");
  }

  async busy(user, busy_date) {
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "You are not a seller!");
    }
    const busy_user = new BusyUserModel({
      seller_user: user._id,
      busy_date: busy_date,
    });
    await busy_user.save();
    if (busy_user) {
      return successResponse(
        busy_user,
        HTTP_STATUS.OK,
        "Seller Schedule Changed To Busy Successfully!"
      );
    } else {
      return internalServerErrorResponse();
    }
  }

  async block(user_id) {
    const user = await UserModel.findById(user_id);
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid Seller!");
    }
    user.is_blocked = true;
    await user.save();
    return successResponse("", HTTP_STATUS.OK, "Seller Blocked Successfully!");
  }

  async unblock(user_id) {
    const user = await UserModel.findById(user_id);
    if (user.role !== ROLE_TYPES.SELLER) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid Seller!");
    }
    user.is_blocked = false;
    await user.save();
    return successResponse(
      "",
      HTTP_STATUS.OK,
      "Seller Unblocked Successfully!"
    );
  }
}

module.exports = SellerService;
