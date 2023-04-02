const asyncHandler = require("express-async-handler");
const OrdersStatus = require("../models/OrdersStatus");
const { ObjectId } = require("mongodb");
const Orders = require("../models/Orders");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const ordersStatuses = await OrdersStatus.find(query).sort(sort);

  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await OrdersStatus.find(query).sort(sort).countDocuments();

  // res.status(200).json({ ordersStatuses: ordersStatuses, count: count });
  res.status(200).json(ordersStatuses);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          { ordersStatusName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const ordersStatuses = await OrdersStatus.find(query).sort(sort);

  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await OrdersStatus.find(query).sort(sort).countDocuments();

  // res.status(200).json({ ordersStatuses: ordersStatuses, count: count });
  res.status(200).json(ordersStatuses);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const ordersStatus = await OrdersStatus.findOne(query);

  res.status(200).json(ordersStatus);
});

const create = asyncHandler(async (req, res) => {
  const ordersStatus = new OrdersStatus({
    orders: req.body.orders,
    ordersStatusName: req.body.ordersStatusName,
    date: req.body.date,
  });

  const savedData = await ordersStatus.save();

  const orders = Orders.findById(req.body.orders);
  await orders.updateOne({
    $push: { ordersStatuses: { $each: [savedData._id], $position: 0 } },
  });

  res.status(200).json(await OrdersStatus.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const ordersStatus = await OrdersStatus.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  ordersStatus.orders = req.body.orders;
  ordersStatus.ordersStatusName = req.body.ordersStatusName;
  ordersStatus.date = req.body.date;

  const savedData = await ordersStatus.save();
  res.status(200).json(await OrdersStatus.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const ordersStatus = await OrdersStatus.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  ordersStatus.active = -1;
  const savedData = await ordersStatus.save();

  await Orders.updateMany(
    { ordersStatuses: req.params.id },
    { $pull: { ordersStatuses: req.params.id } }
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
