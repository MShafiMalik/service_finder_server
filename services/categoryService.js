const CategoryModel = require("../database/models/categories");
const { HTTP_STATUS } = require("../utils/constants");
const {
  successResponse,
  errorResponse,
  convertToCapitalize,
} = require("../utils/utility");

const { CLOUDINARY } = require("../config/config");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

class CategoryService {
  async getAll() {
    const categories = await CategoryModel.find({});
    return successResponse(categories, HTTP_STATUS.OK, "");
  }

  async getOne(category_id) {
    const category = await CategoryModel.findById(category_id);
    return successResponse(category, HTTP_STATUS.OK, "");
  }

  async add(name, image) {
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

  async update(category_id, name, image) {
    const category = await CategoryModel.findById(category_id);
    category.name = convertToCapitalize(name);
    if (image) {
      const img_url = category.image;
      let filename = img_url.substring(img_url.lastIndexOf("/") + 1);
      filename = filename.split(".");
      filename = filename[0];
      cloudinary.uploader.destroy("categories/" + filename);
      category.image = image;
    }
    category.save();
    return successResponse(
      category,
      HTTP_STATUS.OK,
      "Category Updated Successfully!"
    );
  }

  async delete(category_ids) {
    await Promise.all(
      category_ids.map(async (category_id) => {
        const category = await CategoryModel.findById(category_id);
        const img_url = category.image;
        let filename = img_url.substring(img_url.lastIndexOf("/") + 1);
        filename = filename.split(".");
        filename = filename[0];
        await cloudinary.uploader.destroy("categories/" + filename);
        await CategoryModel.findByIdAndDelete(category_id);
      })
    );
    return successResponse(
      "",
      HTTP_STATUS.OK,
      "Categories Deleted Successfully!"
    );
  }
}

module.exports = CategoryService;
