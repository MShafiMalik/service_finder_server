const { HTTP_STATUS } = require("../utils/constants");
const { successResponse, errorResponse } = require("../utils/utility");

class BookingService {
  async add(body) {
    if (!body) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Booking Is Required!");
    }
    return successResponse(body, HTTP_STATUS.OK, "Booking Added Successfully!");
  }
}

module.exports = BookingService;
