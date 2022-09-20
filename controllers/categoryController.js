const categoryService = require("../services/categoryService");
const { constructResponse } = require("../utils/utility");
const CategoryService = new categoryService();

class CategoryController {
  static getAll = async (_req, res) => {
    const responseData = await CategoryService.getAll();
    return constructResponse(res, responseData);
  };

  static getOne = async (req, res) => {
    const { category_id } = req.body;
    const responseData = await CategoryService.getOne(category_id);
    return constructResponse(res, responseData);
  };

  static add = async (req, res) => {
    const { name, image } = req.body;
    const responseData = await CategoryService.add(name, image);
    return constructResponse(res, responseData);
  };

  static update = async (req, res) => {
    const { category_id, name, image } = req.body;
    const responseData = await CategoryService.update(category_id, name, image);
    return constructResponse(res, responseData);
  };

  static delete = async (req, res) => {
    const { category_ids } = req.body;
    const responseData = await CategoryService.delete(category_ids);
    return constructResponse(res, responseData);
  };
}

module.exports = CategoryController;
