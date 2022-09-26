const express = require("express");
const CategoryController = require("../controllers/categoryController");
const router = express.Router();
const ServiceController = require("../controllers/serviceController");
const serviceValidations = require("../controllers/validations/serviceValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAuthToken = require("../middlewares/checkAuthToken");
const CheckAdminToken = require("../middlewares/checkAdminToken");

router.get("/all", ServiceController.getAll);
router.get("/active/all", ServiceController.getActiveAll);
router.post(
  "/search",
  serviceValidations.searchValidations(),
  validateApiRequest,
  ServiceController.search
);

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
router.post(
  "/delete",
  CheckAuthToken,
  serviceValidations.singleServiceValidations(),
  validateApiRequest,
  ServiceController.delete
);
router.post(
  "/pause",
  CheckAuthToken,
  serviceValidations.singleServiceValidations(),
  validateApiRequest,
  ServiceController.pause
);

router.post(
  "/active",
  CheckAuthToken,
  serviceValidations.singleServiceValidations(),
  validateApiRequest,
  ServiceController.active
);

router.post(
  "/block",
  CheckAdminToken,
  serviceValidations.singleServiceValidations(),
  validateApiRequest,
  ServiceController.block
);

router.post(
  "/unblock",
  CheckAdminToken,
  serviceValidations.singleServiceValidations(),
  validateApiRequest,
  ServiceController.unblock
);

module.exports = router;
