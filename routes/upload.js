const { Router } = require("express");
const { uploadImage } = require("../controllers/UploadController");
const { upload } = require("../services/upload.service");
const { protect } = require("../middleware/authMiddleware");

const router = Router();

router.post("/", protect, upload.single("image"), uploadImage);

module.exports = router;
