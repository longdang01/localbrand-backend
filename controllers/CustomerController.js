const asyncHandler = require("express-async-handler");
const Customer = require("../models/Customer");
const { ObjectId } = require("mongodb");

// @desc    GET customers
// @route   GET /api/customers/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const customers = await Customer.find(query).populate("user");

  res.status(200).json(customers);
});

// @desc    POST customers
// @route   POST /api/customers/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const customers = await Customer.find(query).populate("user");

  res.status(200).json(customers);
});

// @desc    Get customers
// @route   GET /api/customers/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const customer = await Customer.findById(query).populate("user");

  res.status(200).json(customer);
});

// @desc    POST customers
// @route   POST /api/customers
// @access  Private
const create = asyncHandler(async (req, res) => {
  const customer = new Customer({
    user: req.body.user,
    customerName: req.body.customerName,
    picture: req.body.picture,
    dob: req.body.dob,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
  });

  const savedData = await customer.save();
  res.status(200).json(await Customer.findById(savedData._id).populate("user"));
});

// @desc    PUT customers
// @route   PUT /api/customers/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  customer.user = req.body.user;
  customer.customerName = req.body.customerName;
  customer.picture = req.body.picture;
  customer.dob = req.body.dob;
  customer.address = req.body.address;
  customer.phone = req.body.phone;
  customer.email = req.body.email;

  const savedData = await customer.save();
  res.status(200).json(await Customer.findById(savedData._id).populate("user"));
});

// @desc    DELETE customers
// @route   DELETE /api/customers/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  customer.isActive = -1;

  const savedData = await customer.save();
  res.status(200).json(await Customer.findById(savedData._id).populate("user"));
});

module.exports = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};
