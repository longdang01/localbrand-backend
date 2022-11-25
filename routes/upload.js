const { Router } = require("express");
const { uploadImage } = require("../controllers/UploadController");
const { upload } = require("../services/upload.service");

const router = Router();

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
