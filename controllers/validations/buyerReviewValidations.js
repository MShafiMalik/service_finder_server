const common = require("./common");

const addBuyerReviewValidations = () => {
  const sellerUserIdValidation = common.sellerUserIdValidations();
  const bookingIdValidation = common.bookingIdValidations();
  const serviceIdValidation = common.serviceIdValidations();
  const ratingValidation = common.ratingValidations();
  const reviewValidation = common.reviewValidations();
  return common.concatValidations(
    sellerUserIdValidation,
    bookingIdValidation,
    serviceIdValidation,
    ratingValidation,
    reviewValidation
  );
};

module.exports = { addBuyerReviewValidations };
