const express = require("express");
const HeroSliderController = require("../controllers/heroSliderController");
const router = express.Router();

router.get("/all", HeroSliderController.getAll);
router.post("/add", HeroSliderController.add);

module.exports = router;
