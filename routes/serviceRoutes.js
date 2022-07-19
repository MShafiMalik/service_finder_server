const express = require("express");
const CategoryController = require("../controllers/categoryController");
const router = express.Router();

router.get("/all", CategoryController.getAll);
router.post("/add", CategoryController.add);

module.exports = router;
