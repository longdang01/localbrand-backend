const asyncHandler = require("express-async-handler");
const ColorImage = require("../models/ColorImage");
const { ObjectId } = require("mongodb");
const Color = require("../models/Color");

// @desc    GET colorImages
// @route   GET /api/colorImages/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const colorImages = await ColorImage.find(query);

  res.status(200).json(colorImages);
});

// @desc    POST colorImages
// @route   POST /api/colorImages/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const colorImages = await ColorImage.find(query);

  res.status(200).json(colorImages);
});

// @desc    Get colorImages
// @route   GET /api/colorImages/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const colorImage = await ColorImage.findById(query);

  res.status(200).json(colorImage);
});

// @desc    POST colorImages
// @route   POST /api/colorImages
// @access  Private
const create = asyncHandler(async (req, res) => {
  const colorImage = new ColorImage({
    color: req.body.color,
    picture: req.body.picture,
  });

  const savedData = await colorImage.save();
  const color = Color.findById(req.body.color);
  await color.updateOne({
    $push: { images: { $each: [savedData._id], $position: 0 } },
  });

  res.status(200).json(savedData);
});

// @desc    PUT colorImages
// @route   PUT /api/colorImages/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const colorImage = await ColorImage.findById(req.params.id);
  colorImage.color = req.body.color;
  colorImage.picture = req.body.picture;

  const savedData = await colorImage.save();
  res.status(200).json(savedData);
});

// @desc    DELETE colorImages
// @route   DELETE /api/colorImages/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const colorImage = await ColorImage.findById(req.params.id);
  colorImage.isActive = -1;

  await Color.updateMany(
    { images: req.params.id },
    { $pull: { images: req.params.id } }
  );
  // const collection = Color.findById(colorImage.collectionInfo);
  // await collection.updateOne({ $pull: { images: req.params.id } });
  const savedData = await colorImage.save();
  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};
