const common = require("./common");

const sendMessageValidations = () => {
  const receiverIdValidation = common.receiverUserIdValidations();
  const messageTextValidation = common.messageTextValidations();
  return common.concatValidations(receiverIdValidation, messageTextValidation);
};

const getChatValidations = () => {
  const receiverIdValidation = common.receiverUserIdValidations();
  return common.concatValidations(receiverIdValidation);
};

module.exports = { sendMessageValidations, getChatValidations };
