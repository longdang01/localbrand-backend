const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const OrdersDetail = require("../models/OrdersDetail");

// @desc    GET ordersDetails
// @route   GET /api/ordersDetails/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const ordersDetails = await OrdersDetail.find(query)
    .sort(sort)
    .populate("product")
    .populate("color")
    .populate("size")
    .populate("orders");

  res.status(200).json(ordersDetails);
});

// @desc    POST ordersDetails
// @route   POST /api/ordersDetails/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = {
    $or: [{ isActive: 1 }, { isActive: 2 }],
  };

  const sort = { createdAt: -1 };
  const ordersDetails = await OrdersDetail.find(query)
    .sort(sort)
    .populate("product")
    .populate("color")
    .populate("size")
    .populate("orders");

  res.status(200).json(ordersDetails);
});

// @desc    Get ordersDetails
// @route   GET /api/ordersDetails/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const ordersDetail = await OrdersDetail.findById(query)
    .populate("product")
    .populate("color")
    .populate("size")
    .populate({
      path: "orders",
      model: "Orders",
      populate: [
        {
          path: "customer",
          model: "Customer",
        },
        {
          path: "deliveryAddress",
          model: "DeliveryAddress",
        },
      ],
    });

  res.status(200).json(ordersDetail);
});

// @desc    POST ordersDetails
// @route   POST /api/ordersDetails
// @access  Private
const create = asyncHandler(async (req, res) => {
  const ordersDetail = new OrdersDetail({
    orders: req.body.orders,
    product: req.body.product,
    color: req.body.color,
    size: req.body.size,
    price: req.body.price,
    quantity: req.body.quantity,
    note: req.body.note,
    status: req.body.status,
  });

  const savedData = await ordersDetail.save();
  res
    .status(200)
    .json(
      await OrdersDetail.findById(savedData._id)
        .populate("product")
        .populate("color")
        .populate("size")
        .populate("orders")
    );
});

// @desc    PUT ordersDetails
// @route   PUT /api/ordersDetails/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const ordersDetail = await OrdersDetail.findById(req.params.id);
  ordersDetail.orders = req.body.orders;
  ordersDetail.product = req.body.product;
  ordersDetail.color = req.body.color;
  ordersDetail.size = req.body.size;
  ordersDetail.price = req.body.price;
  ordersDetail.quantity = req.body.quantity;
  ordersDetail.note = req.body.note;
  ordersDetail.status = req.body.status;

  const savedData = await ordersDetail.save();
  res
    .status(200)
    .json(
      await OrdersDetail.findById(savedData._id)
        .populate("product")
        .populate("color")
        .populate("size")
        .populate("orders")
    );
});

// @desc    DELETE ordersDetails
// @route   DELETE /api/ordersDetails/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const ordersDetail = await OrdersDetail.findById(req.params.id);
  ordersDetail.isActive = -1;

  const savedData = await ordersDetail.save();
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
