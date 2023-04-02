const express = require("express");
const router = express.Router();
const { protect, protectSales } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  create,
  update,
  remove,
} = require("../controllers/CustomerController");

router.post("/search", search);
router.route("/").get(get).post(protect, protectSales, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectSales, update)
  .delete(protect, protectSales, remove);

module.exports = router;
