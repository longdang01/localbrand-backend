const asyncHandler = require("express-async-handler");
const Color = require("../models/Color");
const Product = require("../models/Product");
const Size = require("../models/Size");
const ColorImage = require("../models/ColorImage");
const Discount = require("../models/Discount");
const Price = require("../models/Price");
const { ObjectId } = require("mongodb");

// @desc    GET colors
// @route   GET /api/colors/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const colors = await Color.find(query)
    .populate("product")
    .populate("sizes")
    .populate("images")
    .populate("sales")
    .populate("codes");

  res.status(200).json(colors);
});

// @desc    POST colors
// @route   POST /api/colors/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const colors = await Color.find(query)
    .populate("product")
    .populate("sizes")
    .populate("images")
    .populate("sales")
    .populate("codes");

  res.status(200).json(colors);
});

// @desc    Get colors
// @route   GET /api/colors/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const color = await Color.findById(query)
    .populate("product")
    .populate("sizes")
    .populate("images")
    .populate("sales")
    .populate("codes");

  res.status(200).json(color);
});

// @desc    POST colors
// @route   POST /api/colors
// @access  Private
const create = asyncHandler(async (req, res) => {
  if (!req.body.price) req.body.price = null;
  const color = new Color({
    product: req.body.product,
    price: req.body.price,
    colorName: req.body.colorName,
    hex: req.body.hex,
  });

  const savedData = await color.save();
  const product = Product.findById(req.body.product);
  // await product.updateOne({ $push: { colors: savedData._id } });
  await product.updateOne({
    $push: { colors: { $each: [savedData._id], $position: 0 } },
  });
  res.status(200).json(savedData);
});

// @desc    PUT colors
// @route   PUT /api/colors/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  color.product = req.body.product;
  color.price = req.body.price;
  color.colorName = req.body.colorName;
  color.hex = req.body.hex;

  const savedData = await color.save();
  res.status(200).json(savedData);
});

// @desc    DELETE colors
// @route   DELETE /api/colors/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  color.isActive = -1;

  Size.updateMany({ color: req.params.id }, { color: null });
  ColorImage.updateMany({ color: req.params.id }, { color: null });
  Discount.updateMany({ color: req.params.id }, { color: null });
  Price.updateMany({ color: req.params.id }, { color: null });

  await Product.updateMany(
    { colors: req.params.id },
    { $pull: { colors: req.params.id } }
  );
  const savedData = await color.save();
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
