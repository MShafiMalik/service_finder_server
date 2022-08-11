const { default: mongoose } = require("mongoose");
const ServiceModel = require("../database/models/services");
const CategoryModel = require("../database/models/categories");
const { HTTP_STATUS } = require("../utils/constants");
const { errorResponse, successResponse } = require("../utils/utility");

class ServiceService {
  async getAll() {
    const services = await ServiceModel.aggregate([
      {
        $lookup: {
          from: "users",
          as: "seller",
          let: { user_id: "$seller_user", service_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$user_id"] },
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
                      $expr: { $and: [{ $eq: ["$seller_user", "$$user_id"] }] },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          as: "category",
          localField: "category",
          foreignField: "_id",
        },
      },
      { $unwind: "$category" },
      { $unwind: "$seller" },
    ]).exec();
    return successResponse(services, HTTP_STATUS.OK);
  }

  async single_category(category_id) {
    const category = await CategoryModel.findById(category_id);
    const services = await ServiceModel.aggregate([
      {
        $match: {
          category: mongoose.Types.ObjectId(category_id),
        },
      },
      {
        $lookup: {
          from: "users",
          as: "seller",
          let: { user_id: "$seller_user", service_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$user_id"] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          as: "category",
          localField: "category",
          foreignField: "_id",
        },
      },
      { $unwind: "$category" },
      { $unwind: "$seller" },
    ]).exec();
    return successResponse(
      { category: category, services: services },
      HTTP_STATUS.OK
    );
  }

  async single_service(service_id) {
    const services = await ServiceModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(service_id),
        },
      },
      {
        $lookup: {
          from: "users",
          as: "seller",
          let: { user_id: "$seller_user", service_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$user_id"] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          as: "category",
          localField: "category",
          foreignField: "_id",
        },
      },
      { $unwind: "$category" },
      { $unwind: "$seller" },
    ]).exec();
    const service = services.length > 0 ? services[0] : "";
    return successResponse(service, HTTP_STATUS.OK);
  }

  async add(req) {
    if (req.user.role !== "Seller") {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not A Seller!"
      );
    }
    const body = { seller_user: req.user._id, ...req.body };
    const service = new ServiceModel(body);
    await service.save();
    return successResponse(
      service,
      HTTP_STATUS.OK,
      "Service Created Successfully!"
    );
  }

  async update(req) {
    if (req.user.role !== "Seller") {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not A Seller!"
      );
    }
    const { service_id } = req.body;
    if (!service_id) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Service ID is required!");
    }
    const body = { seller_user: req.user._id, ...req.body };
    delete body.service_id;
    await ServiceModel.findByIdAndUpdate(service_id, {
      $set: body,
    });
    const service = await ServiceModel.findById(service_id);
    return successResponse(
      service,
      HTTP_STATUS.OK,
      "Service Updated Successfully!"
    );
  }

  async delete(req) {
    if (req.user.role !== "Seller") {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not A Seller!"
      );
    }
    const { service_id } = req.body;
    if (!service_id) {
      return errorResponse(
        HTTP_STATUS.CONFLICT,
        "Service ID Field Is Required!"
      );
    }
    const check_service = await ServiceModel.findById(service_id);
    if (!check_service) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Invalid Service ID!");
    }
    const service = await ServiceModel.findByIdAndRemove(service_id);
    return successResponse(
      service,
      HTTP_STATUS.OK,
      "Service Deleted Successfully!"
    );
  }
}

module.exports = ServiceService;
