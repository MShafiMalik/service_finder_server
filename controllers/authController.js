const authService = require("../services/authService");
const AuthService = new authService();
const { constructResponse } = require("../utils/utility");

class AuthController {
  static signup = async (req, res) => {
    const { name, email, password, password_confirmation, role } = req.body;
    const responseData = await AuthService.signup(
      name,
      email,
      password,
      password_confirmation,
      role
    );
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
}

module.exports = AuthController;
