const common = require("./common");

const loginValidations = () => {
  const emailValidation = common.emailValidations();
  const passwordValidation = common.passwordValidations();
  return common.concatValidations(emailValidation, passwordValidation);
};

const changePasswordValidations = () => {
  const oldPasswordValidation = common.oldPasswordValidations();
  const newPasswordValidation = common.newPasswordValidations();
  const confirmPasswordValidation = common.confirmPasswordValidations();
  return common.concatValidations(
    oldPasswordValidation,
    newPasswordValidation,
    confirmPasswordValidation
  );
};

const forgotPasswordValidations = () => {
  const emailValidation = common.emailValidations();
  return common.concatValidations(emailValidation);
};

const resendOtpValidations = () => {
  const jwtIdValidation = common.jwtIdValidations();
  return common.concatValidations(jwtIdValidation);
};

const verifyOtpValidations = () => {
  const jwtIdValidation = common.jwtIdValidations();
  const otpValidation = common.otpValidations();
  return common.concatValidations(jwtIdValidation, otpValidation);
};

const resetPasswordValidations = () => {
  const jwtIdValidation = common.jwtIdValidations();
  const passwordValidation = common.passwordValidations();
  return common.concatValidations(jwtIdValidation, passwordValidation);
};

const profileUpdateValidations = () => {
  const nameValidation = common.nameValidations();
  const emailValidation = common.emailValidations();
  return common.concatValidations(nameValidation, emailValidation);
};

module.exports = {
  loginValidations,
  changePasswordValidations,
  forgotPasswordValidations,
  resendOtpValidations,
  verifyOtpValidations,
  resetPasswordValidations,
  profileUpdateValidations,
};
