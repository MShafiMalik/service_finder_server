const heroSliderService = require("../services/heroSliderService");
const HeroSliderService = new heroSliderService();
const { constructResponse } = require("../utils/utility");

class HeroSliderController {
  static getAll = async (_req, res) => {
    const responseData = await HeroSliderService.getAll();
    return constructResponse(res, responseData);
  };

  static add = async (req, res) => {
    const { title, image } = req.body;
    const responseData = await HeroSliderService.add(title, image);
    return constructResponse(res, responseData);
  };
}

module.exports = HeroSliderController;
