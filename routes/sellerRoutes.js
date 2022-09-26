const express = require("express");
const SellerController = require("../controllers/sellerController");
const router = express.Router();
const sellerValidations = require("../controllers/validations/sellerValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAuthToken = require("../middlewares/checkAuthToken");
const CheckAdminToken = require("../middlewares/checkAdminToken");

router.post(
  "/",
  sellerValidations.getSellerValidations(),
  validateApiRequest,
  SellerController.getOne
);
router.get("/all", SellerController.getAll);
router.get("/me", CheckAuthToken, SellerController.getSellerDetail);
router.post("/busy", CheckAuthToken, SellerController.busy);
router.post(
  "/block",
  CheckAdminToken,
  sellerValidations.getSellerValidations(),
  validateApiRequest,
  SellerController.block
);
router.post(
  "/unblock",
  CheckAdminToken,
  sellerValidations.getSellerValidations(),
  validateApiRequest,
  SellerController.unblock
);

module.exports = router;
