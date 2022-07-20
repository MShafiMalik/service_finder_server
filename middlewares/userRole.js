const { HTTP_STATUS } = require("../utils/constants");
const utility = require("../utils/utility");
const { ROLE_TYPES } = require("../utils/constants");
const userRole = () => (req, res, next) => {
  const { role } = req.body;
  const user_role = utility.convertToCapitalize(role);
  if (user_role === ROLE_TYPES.SELLER || user_role === ROLE_TYPES.BUYER) {
    return next();
  } else {
    const responseData = utility.errorResponse(
      HTTP_STATUS.FORBIDDEN,
      "Incorrect User Role"
    );
    return utility.constructResponse(res, responseData);
  }
};

module.exports = userRole;
