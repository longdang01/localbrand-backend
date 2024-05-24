const express = require("express");
const router = express.Router();
const {
  protect,
  protectSales,
  protectClient,
} = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  create,
  update,
  remove,
} = require("../controllers/CustomerController");

router.post("/search", search);
router.route("/").get(get).post(protect, protectClient, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectClient, update)
  .delete(protect, protectSales, remove);

module.exports = router;
