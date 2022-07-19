const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/serviceController");

router.get("/all", ServiceController.getAll);
router.post("/add", ServiceController.add);

module.exports = router;
