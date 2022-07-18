const { HTTP_STATUS } = require("../utils/constants");
const utility = require("../utils/utility");
const { ROLE_TYPES } = require("../utils/constants");
const userRole = () => (req, res, next) => {
  const { role } = req.body;
  if (role === ROLE_TYPES.SELLER || role === ROLE_TYPES.BUYER) {
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
