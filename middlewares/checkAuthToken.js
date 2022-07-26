const UserModel = require("../database/models/users");
const { HTTP_STATUS } = require("../utils/constants");
const utility = require("../utils/utility");

const CheckAuthToken = async (req, res, next) => {
  let responseData;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      const token = authorization.split(" ")[1];
      const user_id = await utility.getUserIdFromJwtToken(token);
      req.user = await UserModel.findById(user_id);
      return next();
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
module.exports = CheckAuthToken;
