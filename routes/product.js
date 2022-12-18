const express = require("express");
const router = express.Router();

const {
  get,
  search,
  getNew,
  getBestSellers,
  getSales,
  getById,
  create,
  update,
  remove,
} = require("../controllers/ProductController");

//list api
router.post("/search", search);
router.get("/get-new", getNew);
router.get("/get-bestsellers", getBestSellers);
router.get("/get-sales", getSales);
router.route("/").get(get).post(create);
router.route("/:id").get(getById).put(update).delete(remove);

module.exports = router;
