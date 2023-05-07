const express = require("express");
const router = express.Router();

const {
  createPaymentUrl,
  vnPayCallback,
} = require("../controllers/VnPayController");

//list api
router.post("/create-payment-url", createPaymentUrl);
router.get("/vnpay/callback", vnPayCallback);

module.exports = router;
