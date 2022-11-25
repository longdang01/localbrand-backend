const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");
const { ObjectId } = require("mongodb");

// @desc    GET categories
// @route   GET /api/categories/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const categories = await Category.find(query).populate("subCategories");

  res.status(200).json(categories);
});

// @desc    POST categories
// @route   POST /api/categories/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const categories = await Category.find(query).populate("subCategories");

  res.status(200).json(categories);
});

// @desc    Get categories
// @route   GET /api/categories/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const category = await Category.findById(query).populate("subCategories");

  res.status(200).json(category);
});

// @desc    POST categories
// @route   POST /api/categories
// @access  Private
const create = asyncHandler(async (req, res) => {
  const category = new Category({
    categoryName: req.body.categoryName,
    description: req.body.description,
  });

  const savedData = await category.save();
  res.status(200).json(savedData);
});

// @desc    PUT categories
// @route   PUT /api/categories/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  category.categoryName = req.body.categoryName;
  category.description = req.body.description;

  const savedData = await category.save();
  res.status(200).json(savedData);
});

// @desc    DELETE categories
// @route   DELETE /api/categories/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  category.isActive = -1;

  SubCategory.updateMany({ category: req.params.id }, { category: null });
  const savedData = await category.save();
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
