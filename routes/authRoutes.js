const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const validateApiRequest = require("../controllers/validations/validateRequest");
const authValidation = require("../controllers/validations/authValidations");
const userRole = require("../middlewares/userRole");
const CheckAuthToken = require("../middlewares/checkAuthToken");

router.post(
  "/signup",
  authValidation.signupValidations(),
  validateApiRequest,
  userRole(),
  AuthController.signup
);

router.post(
  "/resend-activation-key",
  authValidation.verifyEmailValidations(),
  validateApiRequest,
  AuthController.resend_activation_key
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

router.get("/me", CheckAuthToken, AuthController.detail);

router.post(
  "/forgot-password",
  authValidation.verifyEmailValidations(),
  validateApiRequest,
  AuthController.resend_activation_key
);

router.post(
  "/reset-password",
  authValidation.resetPasswordValidations(),
  validateApiRequest,
  AuthController.reset_password
);

router.post(
  "/change-password",
  CheckAuthToken,
  authValidation.changePasswordValidations(),
  validateApiRequest,
  AuthController.change_password
);

router.post(
  "/add-personal-info",
  authValidation.personalInfoValidations(),
  validateApiRequest,
  AuthController.add_personal_info
);

router.post(
  "/update-profile",
  CheckAuthToken,
  authValidation.updateProfileValidations(),
  validateApiRequest,
  AuthController.updateProfile
);

module.exports = router;
