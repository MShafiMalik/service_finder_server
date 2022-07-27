const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/bookingController");

router.post("/add", BookingController.add);

module.exports = router;
