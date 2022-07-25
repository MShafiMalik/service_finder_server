const common = require("./common");

const addServiceValidations = () => {
  const titleValidation = common.titleValidations();
  const descriptionValidation = common.descriptionValidations();
  const categoryIdValidation = common.categoryIdValidations();
  const latitudeValidation = common.latitudeValidations();
  const longitudeValidation = common.longitudeValidations();
  const addressValidation = common.addressValidations();
  const radiusValidation = common.radiusValidations();
  const packagesValidation = common.packagesValidations();
  // const imagesValidation = imagesValidationFun();
  // const weeklyScheduleValidation = weeklyScheduleValidationFun();
  return common.concatValidations(
    titleValidation,
    descriptionValidation,
    categoryIdValidation,
    latitudeValidation,
    longitudeValidation,
    addressValidation,
    radiusValidation,
    packagesValidation
    // imagesValidation,
    // weeklyScheduleValidation
  );
};

module.exports = { addServiceValidations };
