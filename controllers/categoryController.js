const categoryService = require("../services/categoryService");
const { constructResponse } = require("../utils/utility");
const CategoryService = new categoryService();

class CategoryController {
  static getAll = async (_req, res) => {
    const responseData = await CategoryService.getAll();
    return constructResponse(res, responseData);
  };

  static add = async (req, res) => {
    const { name, image } = req.body;
    const responseData = await CategoryService.add(name, image);
    return constructResponse(res, responseData);
  };
}

module.exports = CategoryController;
