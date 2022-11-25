const asyncHandler = require("express-async-handler");
const Transport = require("../models/Transport");
const { ObjectId } = require("mongodb");

// @desc    GET transports
// @route   GET /api/transports/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const transports = await Transport.find(query);

  res.status(200).json(transports);
});

// @desc    POST transports
// @route   POST /api/transports/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const transports = await Transport.find(query);

  res.status(200).json(transports);
});

// @desc    Get transports
// @route   GET /api/transports/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const transport = await Transport.findById(query);

  res.status(200).json(transport);
});

// @desc    POST transports
// @route   POST /api/transports
// @access  Private
const create = asyncHandler(async (req, res) => {
  const transport = new Transport({
    transportType: req.body.transportType,
    fee: req.body.fee,
    description: req.body.description,
  });

  const savedData = await transport.save();
  res.status(200).json(savedData);
});

// @desc    PUT transports
// @route   PUT /api/transports/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const transport = await Transport.findById(req.params.id);
  transport.transportType = req.body.transportType;
  transport.fee = req.body.fee;
  transport.description = req.body.description;

  const savedData = await transport.save();
  res.status(200).json(savedData);
});

// @desc    DELETE transports
// @route   DELETE /api/transports/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const transport = await Transport.findById(req.params.id);
  transport.isActive = -1;

  // remove orders not handled
  const savedData = await transport.save();
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
