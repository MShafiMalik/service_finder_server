const common = require("./common");

const getSellerValidations = () => {
  const userIdValidation = common.userIdValidations();
  return common.concatValidations(userIdValidation);
};

module.exports = {
  getSellerValidations,
};
