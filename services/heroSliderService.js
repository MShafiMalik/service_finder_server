const HeroSliderModel = require("../database/models/hero_sliders");
const { HTTP_STATUS } = require("../utils/constants");
const {
  successResponse,
  errorResponse,
  convertToCapitalize,
} = require("../utils/utility");

class HeroSliderService {
  async getAll() {
    const hero_sliders = await HeroSliderModel.find({});
    return successResponse(hero_sliders, HTTP_STATUS.OK, "");
  }

  async add(title, image) {
    if (!title || !image) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "All Fields Are Required!");
    }
    title = convertToCapitalize(title);
    const old_hero_slider = await HeroSliderModel.findOne({ title: title });
    if (old_hero_slider) {
      return errorResponse(
        HTTP_STATUS.CONFLICT,
        "Hero Slider Title Already Added!"
      );
    }
    const hero_slider = new HeroSliderModel({
      title: title,
      image: image,
    });
    await hero_slider.save();
    return successResponse(
      hero_slider,
      HTTP_STATUS.OK,
      "Category Created Successfully!"
    );
  }
}

module.exports = HeroSliderService;
