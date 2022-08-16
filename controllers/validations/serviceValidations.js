const common = require("./common");

const searchValidations = () => {
  const keywordValidations = common.keywordValidations();
  const categoryIdValidations = common.catIdValidations();
  const addressValidations = common.addressValidations();
  return common.concatValidations(
    keywordValidations,
    categoryIdValidations,
    addressValidations
  );
};

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
  );
};

const singleServiceValidations = () => {
  const serviceIdValidations = common.serviceIdValidations();
  return common.concatValidations(serviceIdValidations);
};

const singleCategoryValidations = () => {
  const categoryIdValidations = common.catIdValidations();
  return common.concatValidations(categoryIdValidations);
};

module.exports = {
  searchValidations,
  serviceValidations,
  singleCategoryValidations,
  singleServiceValidations,
};
