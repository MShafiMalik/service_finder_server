const { HTTP_STATUS } = require("../utils/constants");
const { errorResponse, successResponse } = require("../utils/utility");

class ServiceService {
  async getAll() {
    return successResponse(
      response,
      HTTP_STATUS.OK,
      "User Created Successfully!"
    );
  }

  async add(body) {
    const {
      title,
      description,
      seller_id,
      category_id,
      latitude,
      longitude,
      basic_pkg_name,
      basic_pkg_description,
      basic_pkg_price,
      standard_pkg_name,
      standard_pkg_description,
      standard_pkg_price,
      premium_pkg_name,
      premium_pkg_description,
      premium_pkg_price,
    } = body;

    if (!body) {
      return errorResponse(
        HTTP_STATUS.CONFLICT,
        "Already Have an account please SignIn"
      );
    }

    return successResponse(body, HTTP_STATUS.OK, "User Created Successfully!");
  }
}

module.exports = ServiceService;
