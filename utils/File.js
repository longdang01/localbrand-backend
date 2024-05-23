const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary");

const parser = new DatauriParser();

const bufferToDataURI = (fileFormat, buffer) =>
  parser.format(fileFormat, buffer);

const handleRemoveFile = async (picture) => {
  if(picture) {
    const folder = picture.split("/")[picture.split("/").length - 2];
    const publicId = picture.split("/").pop().split(".")[0];
    await cloudinary.v2.uploader.destroy(`${folder}/${publicId}`);
  }
};

module.exports = {
  bufferToDataURI,
  handleRemoveFile,
};
