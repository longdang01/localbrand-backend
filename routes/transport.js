const express = require("express");
const router = express.Router();

const {
  get,
  search,
  getById,
  create,
  update,
  remove,
} = require("../controllers/TransportController");

//list api
router.post("/search", search);
router.route("/").get(get).post(create);
router.route("/:id").get(getById).put(update).delete(remove);

module.exports = router;
