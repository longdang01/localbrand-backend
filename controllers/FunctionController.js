const asyncHandler = require("express-async-handler");
const Function = require("../models/Function");
const { ObjectId } = require("mongodb");

// @desc    GET functions
// @route   GET /api/functions/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const functions = await Function.find(query);

  res.status(200).json(functions);
});

// @desc    POST functions
// @route   POST /api/functions/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const functions = await Function.find(query);

  res.status(200).json(functions);
});

// @desc    Get functions
// @route   GET /api/functions/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const functionItem = await Function.findById(query);

  res.status(200).json(functionItem);
});

// @desc    POST functions
// @route   POST /api/functions
// @access  Private
const create = asyncHandler(async (req, res) => {
  const functionItem = new Function({
    functionName: req.body.functionName,
    path: req.body.path,
    description: req.body.description,
  });

  const savedData = await functionItem.save();
  res.status(200).json(savedData);
});

// @desc    PUT functions
// @route   PUT /api/functions/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const functionItem = await Function.findById(req.params.id);
  functionItem.functionName = req.body.functionName;
  functionItem.path = req.body.path;
  functionItem.description = req.body.description;

  const savedData = await functionItem.save();
  res.status(200).json(savedData);
});

// @desc    DELETE functions
// @route   DELETE /api/functions/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const functionItem = await Function.findById(req.params.id);
  functionItem.isActive = -1;

  const savedData = await functionItem.save();
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
