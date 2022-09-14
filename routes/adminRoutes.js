const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const adminValidation = require("../controllers/validations/adminValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAdminToken = require("../middlewares/checkAdminToken");

router.post(
  "/login",
  adminValidation.loginValidations(),
  validateApiRequest,
  AdminController.login
);

router.post(
  "/change-password",
  CheckAdminToken,
  adminValidation.changePasswordValidations(),
  validateApiRequest,
  AdminController.change_password
);

router.get("/me", CheckAdminToken, AdminController.me);

router.post(
  "/forgot-password",
  adminValidation.forgotPasswordValidations(),
  validateApiRequest,
  AdminController.forgot_password
);

router.post(
  "/resend-otp",
  adminValidation.resendOtpValidations(),
  validateApiRequest,
  AdminController.resend_otp
);

router.post(
  "/verify-otp",
  adminValidation.verifyOtpValidations(),
  validateApiRequest,
  AdminController.verify_otp
);

router.post(
  "/reset-password",
  adminValidation.resetPasswordValidations(),
  validateApiRequest,
  AdminController.reset_password
);

router.post(
  "/profile-update",
  CheckAdminToken,
  adminValidation.profileUpdateValidations(),
  validateApiRequest,
  AdminController.profile_update
);

module.exports = router;
