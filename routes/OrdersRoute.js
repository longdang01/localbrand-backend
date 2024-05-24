const express = require("express");
const router = express.Router();
const {
  protect,
  protectClient,
  protectSales,
} = require("../middleware/authMiddleware");

const {
  get,
  search,
  searchByClient,
  getById,
  create,
  update,
  remove,
  getByCode
} = require("../controllers/OrdersController");

router.post("/search", search);
router.post("/search-client", searchByClient);
router.post("/create-client", protect, protectClient, create);
router.put("/update-client/:id", protect, protectClient, update);

router.route("/").get(get).post(protect, protectSales, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectSales, update)
  .delete(protect, protectSales, remove);
router.post("/get-by-code", getByCode);


module.exports = router;
