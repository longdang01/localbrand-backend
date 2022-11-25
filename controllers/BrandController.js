const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Brand = require("../models/Brand");
const Product = require("../models/Product");

// @desc    GET brands
// @route   GET /api/brands/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const brands = await Brand.find(query).sort(sort);

  res.status(200).json(brands);
});

// @desc    POST brands
// @route   POST /api/brands/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const brands = await Brand.find(query).sort(sort);

  res.status(200).json(brands);
});

// @desc    Get brands
// @route   GET /api/brands/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const brand = await Brand.findById(query);

  res.status(200).json(brand);
});

// @desc    POST brands
// @route   POST /api/brands
// @access  Private
const create = asyncHandler(async (req, res) => {
  const brand = new Brand({
    brandName: req.body.brandName,
    description: req.body.description,
  });

  const savedData = await brand.save();
  res.status(200).json(savedData);
});

// @desc    PUT brands
// @route   PUT /api/brands/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  brand.brandName = req.body.brandName;
  brand.description = req.body.description;

  const savedData = await brand.save();
  res.status(200).json(savedData);
});

// @desc    DELETE brands
// @route   DELETE /api/brands/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  brand.isActive = -1;

  await Product.updateMany({ brand: req.params.id }, { brand: null });
  const savedData = await brand.save();
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
