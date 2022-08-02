const CategoryModel = require("../database/models/categories");
const { HTTP_STATUS } = require("../utils/constants");
const {
  successResponse,
  errorResponse,
  convertToCapitalize,
} = require("../utils/utility");

class CategoryService {
  async getAll() {
    const categories = await CategoryModel.find({});
    return successResponse(categories, HTTP_STATUS.OK, "");
  }

  async add(name, image) {
    if (!name || !image) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "All Fields Are Required!");
    }
    name = convertToCapitalize(name);
    const old_category = await CategoryModel.findOne({ name: name });
    if (old_category) {
      return errorResponse(
        HTTP_STATUS.CONFLICT,
        "Category Name Already Added!"
      );
    }
    const category = new CategoryModel({
      name: name,
      image: image,
    });
    await category.save();
    return successResponse(
      category,
      HTTP_STATUS.OK,
      "Category Created Successfully!"
    );
  }
}

module.exports = CategoryService;
