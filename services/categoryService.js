const CategoryModel = require("../database/models/categories");

class CategoryService {
  async getAll() {}

  async add(name) {
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
