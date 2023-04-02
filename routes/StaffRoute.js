const express = require("express");
const router = express.Router();
const { protect, protectAdmin } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  create,
  update,
  remove,
} = require("../controllers/StaffController");

router.post("/search", search);
router.route("/").get(get).post(protect, protectAdmin, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectAdmin, update)
  .delete(protect, protectAdmin, remove);

module.exports = router;
