const express = require("express");
const SellerController = require("../controllers/sellerController");
const router = express.Router();

router.post("/", SellerController.getOne);

module.exports = router;
