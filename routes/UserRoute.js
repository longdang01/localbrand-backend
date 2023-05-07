const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  refreshToken,
  changePassword,
  verifyAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/change-password", protect, changePassword);
router.get("/me", protect, getMe);
router.post("/verify-account", verifyAccount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
