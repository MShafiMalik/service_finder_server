const express = require("express");
const SellerController = require("../controllers/sellerController");
const router = express.Router();
const sellerValidations = require("../controllers/validations/sellerValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");

router.post(
  "/",
  sellerValidations.getSellerValidations(),
  validateApiRequest,
  SellerController.getOne
);

module.exports = router;
