const express = require("express");
const router = express.Router();
const { protect, protectClient } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  getByVariant,
  create,
  update,
  remove,
} = require("../controllers/CartDetailController");

//list api
router.post("/search", search);
router.post("/get-by-variant", getByVariant);
router.route("/").get(get).post(protect, protectClient, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectClient, update)
  .delete(protect, protectClient, remove);

module.exports = router;
