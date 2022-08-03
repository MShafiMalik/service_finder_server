const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/bookingController");
const bookingValidations = require("../controllers/validations/bookingValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAuthToken = require("../middlewares/checkAuthToken");

router.post(
  "/create",
  CheckAuthToken,
  bookingValidations.createBookingValidations(),
  validateApiRequest,
  BookingController.create
);

router.post(
  "/accept",
  CheckAuthToken,
  bookingValidations.bookingIdValidations(),
  validateApiRequest,
  BookingController.accept
);

router.post(
  "/deny",
  CheckAuthToken,
  bookingValidations.bookingIdValidations(),
  validateApiRequest,
  BookingController.deny
);

router.post(
  "/submit",
  CheckAuthToken,
  bookingValidations.bookingIdValidations(),
  validateApiRequest,
  BookingController.submit
);

router.post(
  "/complete",
  CheckAuthToken,
  bookingValidations.bookingIdValidations(),
  validateApiRequest,
  BookingController.complete
);

router.post(
  "/dispute",
  CheckAuthToken,
  bookingValidations.bookingIdValidations(),
  validateApiRequest,
  BookingController.dispute
);

router.post(
  "/dispute-reject",
  CheckAuthToken,
  bookingValidations.bookingIdValidations(),
  validateApiRequest,
  BookingController.dispute_reject
);

router.post(
  "/dispute-accept",
  CheckAuthToken,
  bookingValidations.bookingIdValidations(),
  validateApiRequest,
  BookingController.dispute_accept
);

router.get(
  "/get-pending-all",
  CheckAuthToken,
  BookingController.get_pending_all
);

router.get("/get-active-all", CheckAuthToken, BookingController.get_active_all);

router.get(
  "/get-submitted-all",
  CheckAuthToken,
  BookingController.get_submitted_all
);

router.get(
  "/get-completed-all",
  CheckAuthToken,
  BookingController.get_completed_all
);

router.get(
  "/get-cancelled-all",
  CheckAuthToken,
  BookingController.get_cancelled_all
);

module.exports = router;
