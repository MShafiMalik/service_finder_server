const { default: mongoose } = require("mongoose");
const UserModel = require("../database/models/users");
const { HTTP_STATUS, SERVICE_STATUS } = require("../utils/constants");
const { successResponse, errorResponse } = require("../utils/utility");

class SellerService {
  async getOne(user_id) {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Seller Not Found!");
    }

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
    const seller = sellers.length > 0 ? sellers[0] : "";
    return successResponse(seller, HTTP_STATUS.OK, "");
  }
}

module.exports = SellerService;
