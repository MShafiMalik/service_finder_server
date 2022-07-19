const express = require("express");
const router = express.Router();
const SellerController = require("../controllers/sellerController");

router.post("/add", SellerController.add);

module.exports = router;
