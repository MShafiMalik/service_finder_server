const authService = require("../services/authService");
const AuthService = new authService();
const { constructResponse } = require("../utils/utility");

class AuthController {
  static signup = async (req, res) => {
    const {
      firstname,
      lastname,
      email,
      password,
      password_confirmation,
      role,
    } = req.body;

    const responseData = await AuthService.signup(
      firstname,
      lastname,
      email,
      password,
      password_confirmation,
      role
    );
    return constructResponse(res, responseData);
  };

  static resend_activation_key = async (req, res) => {
    const { email } = req.body;
    const responseData = await AuthService.resend_activation_key(email);
    return constructResponse(res, responseData);
  };

  static login = async (req, res) => {
    const { email, password } = req.body;
    const responseData = await AuthService.login(email, password);
    return constructResponse(res, responseData);
  };

  static verify_email = async (req, res) => {
    const { email, key } = req.body;
    const responseData = await AuthService.verify_email(email, key);
    return constructResponse(res, responseData);
  };

  static reset_password = async (req, res) => {
    const { email, password } = req.body;
    const responseData = await AuthService.reset_password(email, password);
    return constructResponse(res, responseData);
  };

  static add_personal_info = async (req, res) => {
    const { email, phone, image, description, city, state, country } = req.body;
    const responseData = await AuthService.add_personal_info(
      email,
      phone,
      image,
      description,
      city,
      state,
      country
    );
    return constructResponse(res, responseData);
  };
}

module.exports = AuthController;
