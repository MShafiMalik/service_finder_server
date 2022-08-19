const { default: mongoose } = require("mongoose");
const ServiceModel = require("../database/models/services");
const CategoryModel = require("../database/models/categories");
const { HTTP_STATUS, SERVICE_STATUS } = require("../utils/constants");
const { errorResponse, successResponse } = require("../utils/utility");

function calc_distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const latitude1 = toRad(lat1);
  const latitude2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(latitude1) *
      Math.cos(latitude2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c) / 1.609;
}
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

const getServicesInsideRadius = (services, latitude, longitude) => {
  const new_services = [];
  services.forEach((service) => {
    const db_lat = service.latitude;
    const db_lng = service.longitude;
    const distance = calc_distance(db_lat, db_lng, latitude, longitude);
    const radius = service.radius;
    if (distance <= radius) {
      new_services.push(service);
    }
  });
  return new_services;
};

class ServiceService {
  async getAll() {
    const services = await ServiceModel.aggregate([
      {
        $match: {
          status: SERVICE_STATUS.ACTIVE,
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

  async search(keyword, category_id, latitude, longitude) {
    let services = await ServiceModel.aggregate([
      {
        $match: {
          $and: [
            { category: mongoose.Types.ObjectId(category_id) },
            { status: SERVICE_STATUS.ACTIVE },
            { title: { $regex: keyword, $options: "i" } },
          ],
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

    services = getServicesInsideRadius(services, latitude, longitude);

    return successResponse(services, HTTP_STATUS.OK);
  }

  async single_category(category_id) {
    const category = await CategoryModel.findById(category_id);
    const services = await ServiceModel.aggregate([
      {
        $match: {
          $and: [
            { category: mongoose.Types.ObjectId(category_id) },
            { status: SERVICE_STATUS.ACTIVE },
          ],
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

  async pause(req) {
    if (req.user.role !== "Seller") {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not A Seller!"
      );
    }
    const { service_id } = req.body;
    const service = await ServiceModel.findById(service_id);
    if (!service) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Invalid Service ID!");
    }
    service.status = SERVICE_STATUS.PAUSE;
    service.save();
    return successResponse(
      service,
      HTTP_STATUS.OK,
      "Service Paused Successfully!"
    );
  }

  async active(req) {
    if (req.user.role !== "Seller") {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not A Seller!"
      );
    }
    const { service_id } = req.body;
    const service = await ServiceModel.findById(service_id);
    if (!service) {
      return errorResponse(HTTP_STATUS.CONFLICT, "Invalid Service ID!");
    }
    service.status = SERVICE_STATUS.ACTIVE;
    service.save();
    return successResponse(
      service,
      HTTP_STATUS.OK,
      "Service Activated Successfully!"
    );
  }
}

module.exports = ServiceService;
