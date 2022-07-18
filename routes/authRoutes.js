const express = require("express");
const router = express.Router();
const CheckAuthToken = require("../middlewares/checkAuthToken");
const AuthController = require("../controllers/AuthController");
const validateApiRequest = require("../controllers/validations/validateRequest");
const authValidation = require("../controllers/validations/authValidations");
const userRole = require("../middlewares/userRole");

router.post(
  "/auth/signup",
  authValidation.signupValidations(),
  validateApiRequest,
  userRole(),
  AuthController.signup
);

router.post(
  "/auth/login",
  authValidation.loginValidations(),
  validateApiRequest,
  AuthController.login
);

router.post(
  "/auth/verify-email",
  authValidation.verifyEmailValidations(),
  validateApiRequest,
  AuthController.verify_email
);

module.exports = router;
