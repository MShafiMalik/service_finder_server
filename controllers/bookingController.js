const { constructResponse } = require("../utils/utility");
const bookingService = require("../services/bookingService");
const BookingService = new bookingService();

class BookingController {
  static add = async (req, res) => {
    const responseData = await BookingService.add(req.body);
    return constructResponse(res, responseData);
  };
}

module.exports = BookingController;
