const asyncHandler = require("express-async-handler");
const Price = require("../models/Price");
const { ObjectId } = require("mongodb");

// @desc    GET prices
// @route   GET /api/prices/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const prices = await Price.find(query);

  res.status(200).json(prices);
});

// @desc    POST prices
// @route   POST /api/prices/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const prices = await Price.find(query);

  res.status(200).json(prices);
});

// @desc    Get prices
// @route   GET /api/prices/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const price = await Price.findById(query);

  res.status(200).json(price);
});

// @desc    POST prices
// @route   POST /api/prices
// @access  Private
const create = asyncHandler(async (req, res) => {
  const price = new Price({
    price: req.body.price,
  });

  const savedData = await price.save();
  res.status(200).json(savedData);
});

// @desc    PUT prices
// @route   PUT /api/prices/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const price = await Price.findById(req.params.id);
  price.price = req.body.price;

  const savedData = await price.save();
  res.status(200).json(savedData);
});

// @desc    DELETE prices
// @route   DELETE /api/prices/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const price = await Price.findById(req.params.id);
  price.isActive = -1;

  Color.updateMany({ price: req.params.id }, { price: null });
  const savedData = await price.save();
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
