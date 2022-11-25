const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { ObjectId } = require("mongodb");

// @desc    GET subCategories
// @route   GET /api/subCategories/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const subCategories = await SubCategory.find(query);

  res.status(200).json(subCategories);
});

// @desc    POST subCategories
// @route   POST /api/subCategories/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const subCategories = await SubCategory.find(query);

  res.status(200).json(subCategories);
});

// @desc    Get subCategories
// @route   GET /api/subCategories/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const subCategory = await SubCategory.findById(query);

  res.status(200).json(subCategory);
});

// @desc    POST subCategories
// @route   POST /api/subCategories
// @access  Private
const create = asyncHandler(async (req, res) => {
  const subCategory = new SubCategory({
    category: req.body.category,
    subCategoryName: req.body.subCategoryName,
    description: req.body.description,
  });

  const savedData = await subCategory.save();
  const category = Category.findById(req.body.category);
  await category.updateOne({ $push: { subCategories: savedData._id } });

  res.status(200).json(savedData);
});

// @desc    PUT subCategories
// @route   PUT /api/subCategories/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);
  subCategory.category = req.body.category;
  subCategory.subCategoryName = req.body.subCategoryName;
  subCategory.description = req.body.description;

  const savedData = await subCategory.save();
  res.status(200).json(savedData);
});

// @desc    DELETE subCategories
// @route   DELETE /api/subCategories/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);
  subCategory.isActive = -1;

  await Category.updateMany(
    { subCategories: req.params.id },
    { $pull: { subCategories: req.params.id } }
  );

  await Product.updateMany(
    { subCategory: req.params.id },
    { subCategory: null }
  );

  const savedData = await subCategory.save();
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
