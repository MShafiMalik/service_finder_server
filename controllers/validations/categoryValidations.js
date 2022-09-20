const common = require("./common");

const addCategoryValidations = () => {
  const nameValidations = common.nameValidations();
  const imageValidations = common.imageValidations();
  return common.concatValidations(nameValidations, imageValidations);
};

const updateCategoryValidations = () => {
  const categoryIdValidations = common.catIdValidations();
  const nameValidations = common.nameValidations();
  return common.concatValidations(categoryIdValidations, nameValidations);
};

const getCategoryValidations = () => {
  const catIdValidations = common.catIdValidations();
  return common.concatValidations(catIdValidations);
};

const deleteCategoryValidations = () => {
  const categoryIdArrValidations = common.categoryIdArrValidations();
  return common.concatValidations(categoryIdArrValidations);
};

module.exports = {
  addCategoryValidations,
  getCategoryValidations,
  updateCategoryValidations,
  deleteCategoryValidations,
};
