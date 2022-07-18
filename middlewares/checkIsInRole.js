const { HTTP_STATUS } = require("../utils/constants");
const utility = require("../utils/utility");

const checkIsInRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      const responseData = utility.errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized"
      );
      return utility.constructResponse(res, responseData);
    }

    const matchRoles = roles.filter(
      (role) => req.user.roles.indexOf(role) > -1
    );
    if (!matchRoles || matchRoles.length == 0) {
      const responseData = utility.errorResponse(
        HTTP_STATUS.FORBIDDEN,
        "Forbidden"
      );
      return utility.constructResponse(res, responseData);
    }
    return next();
  };

module.exports = checkIsInRole;
