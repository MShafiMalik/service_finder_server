const express = require("express");
const router = express.Router();
const BuyerReviewController = require("../controllers/buyerReviewController");
const validateApiRequest = require("../controllers/validations/validateRequest");
const buyerReviewValidations = require("../controllers/validations/buyerReviewValidations");
const CheckAuthToken = require("../middlewares/checkAuthToken");

router.post(
  "/add",
  CheckAuthToken,
  buyerReviewValidations.addBuyerReviewValidations(),
  validateApiRequest,
  BuyerReviewController.add
);

router.get("/all", CheckAuthToken, BuyerReviewController.get_all);

module.exports = router;
