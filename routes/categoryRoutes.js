const express = require("express");
const CategoryController = require("../controllers/categoryController");
const CheckAdminToken = require("../middlewares/checkAdminToken");
const router = express.Router();
const validateApiRequest = require("../controllers/validations/validateRequest");
const serviceValidations = require("../controllers/validations/serviceValidations");
const categoryValidations = require("../controllers/validations/categoryValidations");

router.get("/all", CategoryController.getAll);

router.post(
  "/get-one",
  categoryValidations.getCategoryValidations(),
  validateApiRequest,
  CategoryController.getOne
);

router.post(
  "/add",
  CheckAdminToken,
  categoryValidations.addCategoryValidations(),
  validateApiRequest,
  CategoryController.add
);

router.post(
  "/update",
  CheckAdminToken,
  categoryValidations.updateCategoryValidations(),
  validateApiRequest,
  CategoryController.update
);

router.post(
  "/delete",
  CheckAdminToken,
  categoryValidations.deleteCategoryValidations(),
  validateApiRequest,
  CategoryController.delete
);

module.exports = router;
