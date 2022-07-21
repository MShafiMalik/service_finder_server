const ServiceModel = require("../database/models/services");
const { HTTP_STATUS } = require("../utils/constants");
const { errorResponse, successResponse } = require("../utils/utility");

const create_service_obj = (req) => {
  const {
    title,
    description,
    category_id,
    address,
    latitude,
    longitude,
    radius,
    basic_pkg_name,
    basic_pkg_description,
    basic_pkg_price,
    standard_pkg_name,
    standard_pkg_description,
    standard_pkg_price,
    premium_pkg_name,
    premium_pkg_description,
    premium_pkg_price,
    images,
  } = req.body;

  if (
    !title ||
    !description ||
    !category_id ||
    !address ||
    !latitude ||
    !longitude ||
    !radius ||
    !basic_pkg_name ||
    !basic_pkg_description ||
    !basic_pkg_price ||
    !standard_pkg_name ||
    !standard_pkg_description ||
    !standard_pkg_price ||
    !premium_pkg_name ||
    !premium_pkg_description ||
    !premium_pkg_price ||
    !Array.isArray(images) ||
    images.length === 0
  ) {
    return "Null Fields";
  }

  return {
    user_id: req.user._id,
    category_id: category_id,
    title: title,
    description: description,
    address: address,
    latitude: latitude,
    longitude: longitude,
    radius: radius,
    packages: {
      basic: {
        name: basic_pkg_name,
        description: basic_pkg_description,
        price: basic_pkg_price,
      },
      standatd: {
        name: standard_pkg_name,
        description: standard_pkg_description,
        price: standard_pkg_price,
      },
      premium: {
        name: premium_pkg_name,
        description: premium_pkg_description,
        price: premium_pkg_price,
      },
    },
    images: images,
  };
};
class ServiceService {
  async getAll() {
    const services = await ServiceModel.find({});
    return successResponse(services, HTTP_STATUS.OK);
  }

  async add(req) {
    if (req.user.role !== "Seller") {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not A Seller!"
      );
    }
    const service_obj = create_service_obj(req);
    if (service_obj === "Null Fields") {
      return errorResponse(HTTP_STATUS.CONFLICT, "All Fields Are Required!");
    }
    const service = new ServiceModel(service_obj);
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
    const service_obj = create_service_obj(req);
    if (service_obj === "Null Fields" || !service_id) {
      return errorResponse(HTTP_STATUS.CONFLICT, "All Fields Are Required!");
    }
    await ServiceModel.findByIdAndUpdate(service_id, {
      $set: service_obj,
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
    const service = await ServiceModel.findByIdAndRemove(service_id);
    return successResponse(
      service,
      HTTP_STATUS.OK,
      "Service Deleted Successfully!"
    );
  }
}

module.exports = ServiceService;
