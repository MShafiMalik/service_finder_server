const { constructResponse } = require("../utils/utility");
const bookingService = require("../services/bookingService");
const BookingService = new bookingService();

class BookingController {
  static create = async (req, res) => {
    const responseData = await BookingService.create(req);
    return constructResponse(res, responseData);
  };

  static accept = async (req, res) => {
    const { booking_id } = req.body;
    const responseData = await BookingService.accept(req.user, booking_id);
    return constructResponse(res, responseData);
  };

  static deny = async (req, res) => {
    const { booking_id } = req.body;
    const responseData = await BookingService.deny(req.user, booking_id);
    return constructResponse(res, responseData);
  };

  static submit = async (req, res) => {
    const { booking_id } = req.body;
    const responseData = await BookingService.submit(req.user, booking_id);
    return constructResponse(res, responseData);
  };

  static complete = async (req, res) => {
    const { booking_id } = req.body;
    const responseData = await BookingService.complete(req.user, booking_id);
    return constructResponse(res, responseData);
  };

  static dispute = async (req, res) => {
    const { booking_id } = req.body;
    const responseData = await BookingService.dispute(req.user, booking_id);
    return constructResponse(res, responseData);
  };

  static dispute_reject = async (req, res) => {
    const { booking_id } = req.body;
    const responseData = await BookingService.dispute_reject(
      req.user,
      booking_id
    );
    return constructResponse(res, responseData);
  };

  static cancel = async (req, res) => {
    const { booking_id } = req.body;
    const responseData = await BookingService.cancel(req.user, booking_id);
    return constructResponse(res, responseData);
  };

  static get_active_all = async (req, res) => {
    const responseData = await BookingService.get_active_all(req.user);
    return constructResponse(res, responseData);
  };

  static get_completed_all = async (req, res) => {
    const responseData = await BookingService.get_completed_all(req.user);
    return constructResponse(res, responseData);
  };

  static get_cancelled_all = async (req, res) => {
    const responseData = await BookingService.get_cancelled_all(req.user);
    return constructResponse(res, responseData);
  };
}

module.exports = BookingController;