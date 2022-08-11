const common = require("./common");

const serviceValidations = () => {
  const titleValidation = common.titleValidations();
  const descriptionValidation = common.descriptionValidations();
  const categoryValidation = common.categoryIdValidations();
  const latitudeValidation = common.latitudeValidations();
  const longitudeValidation = common.longitudeValidations();
  const addressValidation = common.addressValidations();
  const radiusValidation = common.radiusValidations();
  const packagesValidation = common.packagesValidations();
  const imagesValidation = common.imagesValidations();
  // const weeklyScheduleValidation = common.weeklyScheduleValidations();
  return common.concatValidations(
    titleValidation,
    descriptionValidation,
    categoryValidation,
    latitudeValidation,
    longitudeValidation,
    addressValidation,
    radiusValidation,
    packagesValidation,
    imagesValidation
    // weeklyScheduleValidation
  );
};

const singleServiceValidations = () => {
  const serviceIdValidations = common.serviceIdValidations();
  return common.concatValidations(serviceIdValidations);
};

const singleCategoryValidations = () => {
  const categoryIdValidations = common.categoryIdValidations();
  return common.concatValidations(categoryIdValidations);
};

module.exports = {
  serviceValidations,
  singleCategoryValidations,
  singleServiceValidations,
};
