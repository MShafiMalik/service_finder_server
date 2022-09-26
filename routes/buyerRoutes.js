const { response } = require("express");
const express = require("express");
const BuyerController = require("../controllers/buyerController");
const router = express.Router();
const sellerValidations = require("../controllers/validations/sellerValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAdminToken = require("../middlewares/checkAdminToken");

router.post(
  "/",
  sellerValidations.getSellerValidations(),
  validateApiRequest,
  BuyerController.getOne
);
router.get("/all", BuyerController.getAll);
router.post(
  "/block",
  CheckAdminToken,
  sellerValidations.getSellerValidations(),
  validateApiRequest,
  BuyerController.block
);
router.post(
  "/unblock",
  CheckAdminToken,
  sellerValidations.getSellerValidations(),
  validateApiRequest,
  BuyerController.unblock
);

module.exports = router;
