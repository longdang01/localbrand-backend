const { uploadToCloudinary } = require("../services/upload.service");
const { bufferToDataURI } = require("../utils/file");
const asyncHandler = require("express-async-handler");

const uploadImage = asyncHandler(async (req, res) => {
  const { file } = req;
  if (!file) {
    res.status(400);
    throw new Error("Image is required");
  }

  const fileFormat = file.mimetype.split("/")[1];
  const { base64 } = bufferToDataURI(fileFormat, file.buffer);

  const imageDetails = await uploadToCloudinary(base64, fileFormat);

  res.json({
    status: "success",
    message: "Upload successful",
    data: imageDetails,
  });
});

module.exports = {
  uploadImage,
};
