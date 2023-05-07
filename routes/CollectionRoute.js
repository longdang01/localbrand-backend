const express = require("express");
const router = express.Router();
const { protect, protectImport } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  getByPath,
  create,
  update,
  remove,
} = require("../controllers/CollectionController");

router.post("/search", search);
router.post("/get-by-path", getByPath);
router.route("/").get(get).post(protect, protectImport, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectImport, update)
  .delete(protect, protectImport, remove);

module.exports = router;
