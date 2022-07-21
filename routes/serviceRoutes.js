const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/serviceController");
const CheckAuthToken = require("../middlewares/checkAuthToken");

router.get("/all", ServiceController.getAll);
router.post("/add", CheckAuthToken, ServiceController.add);
router.post("/update", CheckAuthToken, ServiceController.update);
router.post("/delete", CheckAuthToken, ServiceController.delete);

module.exports = router;
