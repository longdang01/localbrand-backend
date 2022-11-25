const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
