const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const validateApiRequest = require("../controllers/validations/validateRequest");
const authValidation = require("../controllers/validations/authValidations");
const userRole = require("../middlewares/userRole");

router.post(
  "/signup",
  authValidation.signupValidations(),
  validateApiRequest,
  userRole(),
  AuthController.signup
);

router.post(
  "/login",
  authValidation.loginValidations(),
  validateApiRequest,
  AuthController.login
);

router.post(
  "/verify-email",
  authValidation.verifyEmailValidations(),
  validateApiRequest,
  AuthController.verify_email
);

module.exports = router;
