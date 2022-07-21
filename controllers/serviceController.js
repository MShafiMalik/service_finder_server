const serviceService = require("../services/serviceService");
const ServiceService = new serviceService();
const { constructResponse } = require("../utils/utility");

class ServiceController {
  static getAll = async (_req, res) => {
    const responseData = await ServiceService.getAll();
    return constructResponse(res, responseData);
  };

  static add = async (req, res) => {
    const responseData = await ServiceService.add(req);
    return constructResponse(res, responseData);
  };

  static update = async (req, res) => {
    const responseData = await ServiceService.update(req);
    return constructResponse(res, responseData);
  };

  static delete = async (req, res) => {
    const responseData = await ServiceService.delete(req);
    return constructResponse(res, responseData);
  };
}

module.exports = ServiceController;
