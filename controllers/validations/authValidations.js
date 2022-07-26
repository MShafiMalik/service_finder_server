const common = require("./common");

const signupValidations = () => {
  const firstnameValidation = common.firstnameValidations();
  const lastnameValidation = common.lastnameValidations();
  const emailValidation = common.emailValidations();
  const passwordValidation = common.passwordValidations();
  return common.concatValidations(
    firstnameValidation,
    lastnameValidation,
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
  const emailValidation = common.emailValidations();
  const passwordValidation = common.passwordValidations();
  return common.concatValidations(passwordValidation, emailValidation);
};

const changePasswordValidations = () => {
  const oldPasswordValidation = common.oldPasswordValidations();
  const newPasswordValidation = common.newPasswordValidations();
  return common.concatValidations(oldPasswordValidation, newPasswordValidation);
};

const personalInfoValidations = () => {
  const emailValidation = common.emailValidations();
  const phoneValidation = common.phoneNumberValidations();
  const imageValidation = common.imageValidations();
  const descriptionValidation = common.descriptionValidations();
  const cityValidation = common.cityValidations();
  const stateValidation = common.stateValidations();
  const countryValidation = common.countryValidations();
  return common.concatValidations(
    emailValidation,
    phoneValidation,
    imageValidation,
    descriptionValidation,
    cityValidation,
    stateValidation,
    countryValidation
  );
};

const updateProfileValidations = () => {
  const firstnameValidation = common.firstnameValidations();
  const lastnameValidation = common.lastnameValidations();
  const emailValidation = common.emailValidations();
  const phoneValidation = common.phoneNumberValidations();
  const imageValidation = common.imageValidations();
  const descriptionValidation = common.descriptionValidations();
  const cityValidation = common.cityValidations();
  const stateValidation = common.stateValidations();
  const countryValidation = common.countryValidations();
  return common.concatValidations(
    firstnameValidation,
    lastnameValidation,
    emailValidation,
    phoneValidation,
    imageValidation,
    descriptionValidation,
    cityValidation,
    stateValidation,
    countryValidation
  );
};

module.exports = {
  signupValidations,
  verifyEmailValidations,
  loginValidations,
  forgotPasswordValidations,
  resetPasswordValidations,
  changePasswordValidations,
  personalInfoValidations,
  updateProfileValidations,
};
