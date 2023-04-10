const express = require("express");
const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
const { protect, protectMedia } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  create,
  update,
  remove,
} = require("../controllers/LookbookImageController");

router.post("/search", search);
router.route("/").get(get).post(protect, protectMedia, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectMedia, update)
  .delete(protect, protectMedia, remove);

module.exports = router;
