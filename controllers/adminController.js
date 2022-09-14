const adminService = require("../services/adminService");
const AdminService = new adminService();
const { constructResponse } = require("../utils/utility");

class AdminController {
  static login = async (req, res) => {
    const { email, password } = req.body;
    const responseData = await AdminService.login(email, password);
    return constructResponse(res, responseData);
  };

  static change_password = async (req, res) => {
    const { old_password, new_password, confirm_password } = req.body;
    const responseData = await AdminService.change_password(
      req.admin,
      old_password,
      new_password,
      confirm_password
    );
    return constructResponse(res, responseData);
  };

  static me = async (req, res) => {
    const responseData = await AdminService.me(req.admin);
    return constructResponse(res, responseData);
  };

  static forgot_password = async (req, res) => {
    const { email } = req.body;
    const responseData = await AdminService.forgot_password(email);
    return constructResponse(res, responseData);
  };

  static resend_otp = async (req, res) => {
    const { jwt_id } = req.body;
    const responseData = await AdminService.resend_otp(jwt_id);
    return constructResponse(res, responseData);
  };

  static verify_otp = async (req, res) => {
    const { jwt_id, otp } = req.body;
    const responseData = await AdminService.verify_otp(jwt_id, otp);
    return constructResponse(res, responseData);
  };

  static reset_password = async (req, res) => {
    const { jwt_id, password } = req.body;
    const responseData = await AdminService.reset_password(jwt_id, password);
    return constructResponse(res, responseData);
  };

  static profile_update = async (req, res) => {
    const { name, email, image } = req.body;
    const responseData = await AdminService.profile_update(
      req.admin,
      name,
      email,
      image
    );
    return constructResponse(res, responseData);
  };
}

module.exports = AdminController;
