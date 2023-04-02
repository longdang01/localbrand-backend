const express = require("express");
const router = express.Router();
const { protect, protectImport } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  create,
  update,
  remove,
} = require("../controllers/SubCategoryController");

router.post("/search", search);
router.route("/").get(get).post(protect, protectImport, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectImport, update)
  .delete(protect, protectImport, remove);

module.exports = router;
