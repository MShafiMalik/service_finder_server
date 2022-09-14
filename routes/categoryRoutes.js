const express = require("express");
const CategoryController = require("../controllers/categoryController");
const CheckAdminToken = require("../middlewares/checkAdminToken");
const router = express.Router();

router.get("/all", CategoryController.getAll);
router.post("/add", CheckAdminToken, CategoryController.add);

module.exports = router;
