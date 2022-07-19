const CategoryModel = require("../database/models/categories");
const { HTTP_STATUS } = require("../utils/constants");
const { successResponse, errorResponse } = require("../utils/utility");

const capitalize = (word) => {
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
};

class CategoryService {
  async getAll() {
    const categories = await CategoryModel.find({});
    return successResponse(
      categories,
      HTTP_STATUS.OK,
      "Category Created Successfully!"
    );
  }

  async add(name) {
    if (!name) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Category Name Is Required!");
    }
    name = capitalize(name);
    const old_category = await CategoryModel.findOne({ name: name });
    if (old_category) {
      return errorResponse(
        HTTP_STATUS.CONFLICT,
        "Category Name Already Added!"
      );
    }
    const category = new CategoryModel({
      name: name,
    });
    await category.save();
    const response = {
      name: category.name,
    };
    return successResponse(
      response,
      HTTP_STATUS.OK,
      "Category Created Successfully!"
    );
  }
}

module.exports = CategoryService;
