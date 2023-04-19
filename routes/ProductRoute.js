const express = require("express");
const router = express.Router();
const { protect, protectImport } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getByClient,
  getByPath,
  getById,
  create,
  update,
  remove,
} = require("../controllers/ProductController");

router.post("/search", search);
router.post("/get-by-client", getByClient);
router.post("/get-by-path", getByPath);
router.route("/").get(get).post(protect, protectImport, create);
router
  .route("/:id")
  .get(getById)
  .put(protect, protectImport, update)
  .delete(protect, protectImport, remove);

module.exports = router;
