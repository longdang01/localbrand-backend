const asyncHandler = require("express-async-handler");
const DeliveryAddress = require("../models/DeliveryAddress");
const { ObjectId } = require("mongodb");

// @desc    GET deliveryAddress
// @route   GET /api/deliveryAddress/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };

  const deliveryAddressList = await DeliveryAddress.find(query).sort(sort);

  res.status(200).json(deliveryAddressList);
});

// @desc    POST deliveryAddress
// @route   POST /api/deliveryAddress/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const deliveryAddressList = await DeliveryAddress.find(query).sort(sort);

  res.status(200).json(deliveryAddressList);
});

// @desc    Get deliveryAddress
// @route   GET /api/deliveryAddress/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const deliveryAddress = await DeliveryAddress.findById(query);

  res.status(200).json(deliveryAddress);
});

// @desc    POST deliveryAddress
// @route   POST /api/deliveryAddress
// @access  Private
const create = asyncHandler(async (req, res) => {
  const deliveryAddress = new DeliveryAddress({
    customer: req.body.customer,
    deliveryAddressName: req.body.deliveryAddressName,
    consigneeName: req.body.consigneeName,
    consigneePhone: req.body.consigneePhone,
  });

  const savedData = await deliveryAddress.save();
  res.status(200).json(savedData);
});

// @desc    PUT deliveryAddress
// @route   PUT /api/deliveryAddress/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const deliveryAddress = await DeliveryAddress.findById(req.params.id);
  deliveryAddress.customer = req.body.customer;
  deliveryAddress.deliveryAddressName = req.body.deliveryAddressName;
  deliveryAddress.consigneeName = req.body.consigneeName;
  deliveryAddress.consigneePhone = req.body.consigneePhone;

  const savedData = await deliveryAddress.save();
  res.status(200).json(savedData);
});

// @desc    DELETE deliveryAddress
// @route   DELETE /api/deliveryAddress/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const deliveryAddress = await DeliveryAddress.findById(req.params.id);
  deliveryAddress.isActive = -1;

  const savedData = await deliveryAddress.save();
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
