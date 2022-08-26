const express = require("express");
const SellerController = require("../controllers/sellerController");
const router = express.Router();
const sellerValidations = require("../controllers/validations/sellerValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAuthToken = require("../middlewares/checkAuthToken");

router.post(
  "/",
  sellerValidations.getSellerValidations(),
  validateApiRequest,
  SellerController.getOne
);

router.post("/me", CheckAuthToken, SellerController.getSellerDetail);

router.post("/busy", CheckAuthToken, SellerController.busy);

module.exports = router;
