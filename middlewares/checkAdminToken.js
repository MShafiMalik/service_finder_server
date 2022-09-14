const AdminModel = require("../database/models/admins");
const { HTTP_STATUS } = require("../utils/constants");
const utility = require("../utils/utility");

const CheckAdminToken = async (req, res, next) => {
  let responseData;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      const token = authorization.split(" ")[1];
      const user_id = await utility.getUserIdFromJwtToken(token);

      const admin = await AdminModel.findById(user_id);
      if (admin) {
        req.admin = admin;
        return next();
      } else {
        responseData = utility.errorResponse(
          HTTP_STATUS.FORBIDDEN,
          "Unauthorized User, No Token, Please Login..."
        );
        return utility.constructResponse(res, responseData);
      }
    } catch (error) {
      responseData = utility.errorResponse(
        HTTP_STATUS.FORBIDDEN,
        "Unauthorized User, No Token, Please Login..."
      );
      return utility.constructResponse(res, responseData);
    }
  } else {
    responseData = utility.errorResponse(
      HTTP_STATUS.FORBIDDEN,
      "Unauthorized User, No Token, Please Login..."
    );
    return utility.constructResponse(res, responseData);
  }
};
module.exports = CheckAdminToken;
