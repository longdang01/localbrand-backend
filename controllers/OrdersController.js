const asyncHandler = require("express-async-handler");
const Orders = require("../models/Orders");
const OrdersStatus = require("../models/OrdersStatus");
const OrdersDetail = require("../models/OrdersDetail");
const { ObjectId } = require("mongodb");

// @desc    GET orders
// @route   GET /api/orders/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const ordersList = await Orders.find(query)
    .sort(sort)
    .populate("payment")
    .populate("transport")
    .populate({
      path: "deliveryAddress",
      populate: [
        {
          path: "customer",
          model: "Customer",
        },
      ],
    })
    .populate("ordersDetails")
    .populate("ordersStatus");

  res.status(200).json(ordersList);
});

// @desc    POST orders
// @route   POST /api/orders/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const ordersList = await Orders.find(query)
    .sort(sort)
    .populate("payment")
    .populate("transport")
    .populate({
      path: "deliveryAddress",
      populate: [
        {
          path: "customer",
          model: "Customer",
        },
      ],
    })
    .populate("ordersDetails")
    .populate("ordersStatus");

  res.status(200).json(ordersList);
});

// @desc    Get orders
// @route   GET /api/orders/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const orders = await Orders.findById(query)
    .populate("payment")
    .populate("transport")
    .populate({
      path: "deliveryAddress",
      populate: [
        {
          path: "customer",
          model: "Customer",
        },
      ],
    })
    .populate("ordersDetails")
    .populate("ordersStatus");

  res.status(200).json(orders);
});

// @desc    POST orders
// @route   POST /api/orders
// @access  Private
const create = asyncHandler(async (req, res) => {
  if (!req.body.note) req.body.note = null;
  const orders = new Orders({
    payment: req.body.payment,
    transport: req.body.transport,
    deliveryAddress: req.body.deliveryAddress,
    orderDate: req.body.orderDate.slice(0, 10),
    note: req.body.note,
    total: req.body.total,
    status: req.body.status,
    paid: req.body.paid,
  });

  const savedData = await orders.save();
  res.status(200).json(
    await Orders.findById(savedData._id)
      .populate("payment")
      .populate("transport")
      .populate({
        path: "deliveryAddress",
        populate: [
          {
            path: "customer",
            model: "Customer",
          },
        ],
      })
      .populate("ordersDetails")
      .populate("ordersStatus")
  );
});

// @desc    PUT orders
// @route   PUT /api/orders/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const orders = await Orders.findById(req.params.id);
  orders.payment = req.body.payment;
  orders.transport = req.body.transport;
  orders.deliveryAddress = req.body.deliveryAddress;
  orders.orderDate = req.body.orderDate.slice(0, 10);
  orders.note = req.body.note;
  orders.total = req.body.total;
  orders.status = req.body.status;
  orders.paid = req.body.paid;

  const savedData = await orders.save();
  res.status(200).json(
    await Orders.findById(savedData._id)
      .populate("payment")
      .populate("transport")
      .populate({
        path: "deliveryAddress",
        populate: [
          {
            path: "customer",
            model: "Customer",
          },
        ],
      })
      .populate("ordersDetails")
      .populate("ordersStatus")
  );
});

// @desc    DELETE orders
// @route   DELETE /api/orders/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const orders = await Orders.findById(req.params.id);
  orders.isActive = -1;

  await OrdersStatus.updateMany({ orders: req.params.id }, { orders: null });
  await OrdersDetail.updateMany({ orders: req.params.id }, { orders: null });

  //remove orders of Customer { orders[]} ?
  const savedData = await orders.save();
  res.status(200).json(
    await Orders.findById(savedData._id)
      .populate("payment")
      .populate("transport")
      .populate({
        path: "deliveryAddress",
        populate: [
          {
            path: "customer",
            model: "Customer",
          },
        ],
      })
      .populate("ordersDetails")
      .populate("ordersStatus")
  );
});

module.exports = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};
