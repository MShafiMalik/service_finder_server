const ServiceModel = require("../database/models/services");
const { HTTP_STATUS } = require("../utils/constants");
const { errorResponse, successResponse } = require("../utils/utility");

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
    const body = { user_id: req.user._id, ...req.body };
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
    const body = { user_id: req.user._id, ...req.body };
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
