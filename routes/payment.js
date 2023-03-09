const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  create,
  update,
  remove,
  checkout,
  vnPayCallback,
} = require("../controllers/PaymentController");

//list api
router.post("/search", search);
router.route("/").get(get).post(create);
router.route("/:id").get(getById).put(update).delete(remove);
router.post("/checkout", checkout);
router.get("/vnpay/callback", vnPayCallback);

module.exports = router;
