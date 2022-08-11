const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/serviceController");
const serviceValidations = require("../controllers/validations/serviceValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAuthToken = require("../middlewares/checkAuthToken");

router.get("/all", ServiceController.getAll);
router.post(
  "/single-category",
  serviceValidations.singleCategoryValidations(),
  validateApiRequest,
  ServiceController.single_category
);
router.post(
  "/single-service",
  serviceValidations.singleServiceValidations(),
  validateApiRequest,
  ServiceController.single_service
);
router.post(
  "/add",
  CheckAuthToken,
  serviceValidations.serviceValidations(),
  validateApiRequest,
  ServiceController.add
);
router.post(
  "/update",
  CheckAuthToken,
  serviceValidations.serviceValidations(),
  validateApiRequest,
  ServiceController.update
);
router.post("/delete", CheckAuthToken, ServiceController.delete);

module.exports = router;
