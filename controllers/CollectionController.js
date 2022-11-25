const asyncHandler = require("express-async-handler");
const Collection = require("../models/Collection");
const Product = require("../models/Product");
const { ObjectId } = require("mongodb");
const CollectionImage = require("../models/CollectionImage");

// @desc    GET collections
// @route   GET /api/collections/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const collections = await Collection.find(query)
    .sort(sort)
    .populate("images")
    .populate("products");

  res.status(200).json(collections);
});

// @desc    POST collections
// @route   POST /api/collections/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const collections = await Collection.find(query)
    .sort(sort)
    .populate("images")
    .populate("products");

  res.status(200).json(collections);
});

// @desc    Get collections
// @route   GET /api/collections/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const collection = await Collection.findById(query)
    .populate("images")
    .populate("products");

  res.status(200).json(collection);
});

// @desc    POST collections
// @route   POST /api/collections
// @access  Private
const create = asyncHandler(async (req, res) => {
  const collection = new Collection({
    collectionName: req.body.collectionName,
    description: req.body.description,
  });

  const savedData = await collection.save();
  res.status(200).json(savedData);
});

// @desc    PUT collections
// @route   PUT /api/collections/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  collection.collectionName = req.body.collectionName;
  collection.description = req.body.description;

  const savedData = await collection.save();
  res.status(200).json(savedData);
});

// @desc    DELETE collections
// @route   DELETE /api/collections/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  collection.isActive = -1;

  await CollectionImage.updateMany(
    { collectionInfo: req.params.id },
    { collectionInfo: null }
  );

  await Product.updateMany(
    { collectionInfo: req.params.id },
    { collectionInfo: null }
  );

  const savedData = await collection.save();
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
