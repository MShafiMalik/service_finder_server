const common = require("./common");

const createBookingValidations = () => {
  const sellerUserIdValidation = common.sellerUserIdValidations();
  const serviceIdValidation = common.serviceIdValidations();
  const workStartDateValidation = common.workStartDateValidations();
  const workStartTimeValidation = common.workStartTimeValidations();
  return common.concatValidations(
    sellerUserIdValidation,
    serviceIdValidation,
    workStartDateValidation,
    workStartTimeValidation
  );
};

const bookingIdValidations = () => {
  const bookingIdValidation = common.bookingIdValidations();
  return common.concatValidations(bookingIdValidation);
};

const sellerUserIdValidations = () => {
  const sellerUserIdValidation = common.sellerUserIdValidations();
  return common.concatValidations(sellerUserIdValidation);
};

module.exports = {
  createBookingValidations,
  bookingIdValidations,
  sellerUserIdValidations,
};
