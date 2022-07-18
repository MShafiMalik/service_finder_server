const common = require("./common");

const signupValidations = () => {
  const nameValidation = common.nameValidations();
  const emailValidation = common.emailValidations();
  const passwordValidation = common.passwordValidations();
  return common.concatValidations(
    nameValidation,
    emailValidation,
    passwordValidation
  );
};

const loginValidations = () => {
  const emailValidation = common.emailValidations();
  const passwordValidation = common.passwordValidations();
  return common.concatValidations(emailValidation, passwordValidation);
};

const verifyEmailValidations = () => {
  const emailValidation = common.emailValidations();
  return common.concatValidations(emailValidation);
};

const forgotPasswordValidations = () => {
  const emailValidation = common.emailValidations();
  return common.concatValidations(emailValidation);
};

const resetPasswordValidations = () => {
  const tokenValidation = common.emailVerificationTokenValidations();
  const passwordValidation = common.passwordValidations();
  return common.concatValidations(passwordValidation, tokenValidation);
};

module.exports = {
  signupValidations,
  verifyEmailValidations,
  loginValidations,
  forgotPasswordValidations,
  resetPasswordValidations,
};
