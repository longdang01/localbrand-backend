const asyncHandler = require("express-async-handler");
const OrdersStatus = require("../models/OrdersStatus");
const { ObjectId } = require("mongodb");
const Orders = require("../models/Orders");

// @desc    GET ordersStatus
// @route   GET /api/ordersStatus/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const ordersStatusList = await OrdersStatus.find(query).sort(sort);

  res.status(200).json(ordersStatusList);
});

// @desc    POST ordersStatus
// @route   POST /api/ordersStatus/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const ordersStatusList = await OrdersStatus.find(query).sort(sort);

  res.status(200).json(ordersStatusList);
});

// @desc    Get ordersStatus
// @route   GET /api/ordersStatus/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const ordersStatus = await OrdersStatus.findById(query);

  res.status(200).json(ordersStatus);
});

// @desc    POST ordersStatus
// @route   POST /api/ordersStatus
// @access  Private
const create = asyncHandler(async (req, res) => {
  const ordersStatus = new OrdersStatus({
    orders: req.body.orders,
    ordersStatusName: req.body.ordersStatusName,
    date: req.body.date,
  });

  const savedData = await ordersStatus.save();
  const orders = Orders.findById(req.body.orders);
  await orders.updateOne({ $push: { ordersStatus: savedData._id } });
  res.status(200).json(savedData);
});

// @desc    PUT ordersStatus
// @route   PUT /api/ordersStatus/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const ordersStatus = await OrdersStatus.findById(req.params.id);
  ordersStatus.orders = req.body.orders;
  ordersStatus.ordersStatusName = req.body.ordersStatusName;
  ordersStatus.date = req.body.date;

  const savedData = await ordersStatus.save();
  res.status(200).json(savedData);
});

// @desc    DELETE ordersStatus
// @route   DELETE /api/ordersStatus/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const ordersStatus = await OrdersStatus.findById(req.params.id);
  ordersStatus.isActive = -1;

  const savedData = await ordersStatus.save();
  await Orders.updateMany(
    { ordersStatus: req.params.id },
    { $pull: { ordersStatus: req.params.id } }
  );
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
