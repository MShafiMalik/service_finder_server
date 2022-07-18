const { validateRequest } = require("./common");
const { logBadRequestAndResponse } = require("../../utils/utility");

const validateApiRequest = (req, res, next) => {
  const errors = validateRequest(req);
  if (errors.isEmpty()) {
    return next();
  }
  return logBadRequestAndResponse(req, res, errors);
};

module.exports = validateApiRequest;
