const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/serviceController");
const serviceValidations = require("../controllers/validations/serviceValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAuthToken = require("../middlewares/checkAuthToken");
const authValidation = require("../controllers/validations/authValidations");

router.get("/all", ServiceController.getAll);
router.post(
  "/add",
  CheckAuthToken,
  serviceValidations.addServiceValidations(),
  validateApiRequest,
  ServiceController.add
);
router.post("/update", CheckAuthToken, ServiceController.update);
router.post("/delete", CheckAuthToken, ServiceController.delete);

module.exports = router;
