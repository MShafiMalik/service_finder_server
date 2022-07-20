const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const validateApiRequest = require("../controllers/validations/validateRequest");
const authValidation = require("../controllers/validations/authValidations");
const userRole = require("../middlewares/userRole");
const UserModel = require("../database/models/users");

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
  "/add-personal-info",
  authValidation.personalInfoValidations(),
  validateApiRequest,
  AuthController.add_personal_info
);

router.post("/del-user", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    re.send("Email is required");
  }
  const user = await UserModel.findOneAndRemove({ email: email });
  if (user) {
    res.send({ user: user, message: "User Deleted" });
  } else {
    res.send("Invalid Email");
  }
});

module.exports = router;
