const common = require("./common");

const createBookingValidations = () => {
  const sellerUserIdValidation = common.sellerUserIdValidations();
  const serviceIdValidation = common.serviceIdValidations();
  const workStartDatetimeValidation = common.workStartDatetimeValidations();
  return common.concatValidations(
    sellerUserIdValidation,
    serviceIdValidation,
    workStartDatetimeValidation
  );
};

const bookingIdValidations = () => {
  const bookingIdValidation = common.bookingIdValidations();
  return common.concatValidations(bookingIdValidation);
};

module.exports = { createBookingValidations, bookingIdValidations };
