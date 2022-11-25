const asyncHandler = require("express-async-handler");
const Payment = require("../models/Payment");
const { ObjectId } = require("mongodb");

// @desc    GET payments
// @route   GET /api/payments/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const payments = await Payment.find(query);

  res.status(200).json(payments);
});

// @desc    POST payments
// @route   POST /api/payments/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const payments = await Payment.find(query);

  res.status(200).json(payments);
});

// @desc    Get payments
// @route   GET /api/payments/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const payment = await Payment.findById(query);

  res.status(200).json(payment);
});

// @desc    POST payments
// @route   POST /api/payments
// @access  Private
const create = asyncHandler(async (req, res) => {
  const payment = new Payment({
    paymentType: req.body.paymentType,
    description: req.body.description,
  });

  const savedData = await payment.save();
  res.status(200).json(savedData);
});

// @desc    PUT payments
// @route   PUT /api/payments/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  payment.paymentType = req.body.paymentType;
  payment.description = req.body.description;

  const savedData = await payment.save();
  res.status(200).json(savedData);
});

// @desc    DELETE payments
// @route   DELETE /api/payments/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  payment.isActive = -1;

  // remove orders not handled
  const savedData = await payment.save();
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
