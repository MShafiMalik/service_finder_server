const serviceService = require("../services/serviceService");
const ServiceService = new serviceService();
const { constructResponse } = require("../utils/utility");

class ServiceController {
  static getAll = async (_req, res) => {
    const responseData = await ServiceService.getAll();
    return constructResponse(res, responseData);
  };

  static search = async (req, res) => {
    const { keyword, category_id, latitude, longitude } = req.body;
    const responseData = await ServiceService.search(
      keyword,
      category_id,
      latitude,
      longitude
    );
    return constructResponse(res, responseData);
  };

  static single_category = async (req, res) => {
    const { category_id } = req.body;
    const responseData = await ServiceService.single_category(category_id);
    return constructResponse(res, responseData);
  };

  static single_service = async (req, res) => {
    const { service_id } = req.body;
    const responseData = await ServiceService.single_service(service_id);
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

  static pause = async (req, res) => {
    const responseData = await ServiceService.pause(req);
    return constructResponse(res, responseData);
  };

  static active = async (req, res) => {
    const responseData = await ServiceService.active(req);
    return constructResponse(res, responseData);
  };
}

module.exports = ServiceController;
