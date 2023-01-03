const asyncHandler = require("express-async-handler");
const Size = require("../models/Size");
const Color = require("../models/Color");
const { ObjectId } = require("mongodb");

// @desc    GET sizes
// @route   GET /api/sizes/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: { $ne: -1 } };
  const sizes = await Size.find(query);

  res.status(200).json(sizes);
});

// @desc    POST sizes
// @route   POST /api/sizes/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: { $ne: -1 } };
  const sizes = await Size.find(query);

  res.status(200).json(sizes);
});

// @desc    Get sizes
// @route   GET /api/sizes/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const size = await Size.findById(query);

  res.status(200).json(size);
});

// @desc    POST sizes
// @route   POST /api/sizes
// @access  Private
const create = asyncHandler(async (req, res) => {
  const size = new Size({
    color: req.body.color,
    sizeName: req.body.sizeName,
    quantity: req.body.quantity,
    isActive: req.body.isActive,
  });

  const savedData = await size.save();
  const color = Color.findById(req.body.color);
  await color.updateOne({ $push: { sizes: savedData._id } });
  res.status(200).json(savedData);
});

// @desc    PUT sizes
// @route   PUT /api/sizes/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const size = await Size.findById(req.params.id);
  size.color = req.body.color;
  size.sizeName = req.body.sizeName;
  size.quantity = req.body.quantity;
  size.isActive = req.body.isActive;

  const savedData = await size.save();
  res.status(200).json(savedData);
});

// @desc    DELETE sizes
// @route   DELETE /api/sizes/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const size = await Size.findById(req.params.id);
  size.isActive = -1;

  await Color.updateMany(
    { sizes: req.params.id },
    { $pull: { sizes: req.params.id } }
  );
  const savedData = await size.save();
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
