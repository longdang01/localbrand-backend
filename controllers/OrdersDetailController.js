const asyncHandler = require("express-async-handler");
const OrdersDetail = require("../models/OrdersDetail");
const Orders = require("../models/Orders");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const ordersDetails = await OrdersDetail.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await OrdersDetail.find(query).sort(sort).countDocuments();

  // res.status(200).json({ ordersDetails: ordersDetails, count: count });
  res.status(200).json(ordersDetails);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          // { categoryName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const ordersDetails = await OrdersDetail.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await OrdersDetail.find(query).sort(sort).countDocuments();

  // res.status(200).json({ ordersDetails: ordersDetails, count: count });
  res.status(200).json(ordersDetails);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const ordersDetail = await OrdersDetail.findOne(query);

  res.status(200).json(ordersDetail);
});

const create = asyncHandler(async (req, res) => {
  const ordersDetail = new OrdersDetail({
    orders: req.body.orders,
    product: req.body.product,
    color: req.body.color,
    size: req.body.size,
    price: req.body.price,
    quantity: req.body.quantity,
  });
  const savedData = await ordersDetail.save();

  res.status(200).json(await OrdersDetail.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const ordersDetail = await OrdersDetail.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  ordersDetail.orders = req.body.orders;
  ordersDetail.product = req.body.product;
  ordersDetail.color = req.body.color;
  ordersDetail.size = req.body.size;
  ordersDetail.price = req.body.price;
  ordersDetail.quantity = req.body.quantity;

  const savedData = await ordersDetail.save();
  res.status(200).json(await OrdersDetail.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const ordersDetail = await OrdersDetail.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  ordersDetail.active = -1;
  const savedData = await ordersDetail.save();
  await Orders.updateMany(
    { ordersDetails: req.params.id },
    { $pull: { ordersDetails: req.params.id } }
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
