const asyncHandler = require("express-async-handler");
const Orders = require("../models/Orders");
const Product = require("../models/Product");
const OrdersDetail = require("../models/OrdersDetail");
const Color = require("../models/Color");
const Size = require("../models/Size");
const { ObjectId } = require("mongodb");
const { generateCodeRandom } = require("../utils/Functions");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const orderses = await Orders.find(query)
    .sort(sort)
    .populate("ordersDetails")
    .populate("ordersStatuses");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Orders.find(query).sort(sort).countDocuments();
  const products = await Product.find(query);

  // res.status(200).json({ orderses: orderses, count: count });
  res.status(200).json({ orderses: orderses, products: products });
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };
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

  const orderses = await Orders.find(query)
    .sort(sort)
    .populate("ordersDetails")
    .populate("ordersStatuses");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Orders.find(query).sort(sort).countDocuments();

  // res.status(200).json({ orderses: orderses, count: count });
  const products = await Product.find(query);

  res.status(200).json({ orderses: orderses, products: products });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const orders = await Orders.findOne(query)
    .populate({
      path: "ordersDetails",
      populate: [
        {
          path: "product",
          model: "Product",
        },
        {
          path: "color",
          model: "Color",
        },
        {
          path: "size",
          model: "Size",
        },
      ],
    })
    .populate("ordersStatuses");

  res.status(200).json(orders);
});

const create = asyncHandler(async (req, res) => {
  // details
  const query = { active: 1 };
  const orderses = (await Orders.find(query)) || [];

  const ordersCode = await generateCodeRandom("OD", orderses, "ordersCode", 5);

  const orders = new Orders({
    customer: req.body.customer || null,
    deliveryAddress: req.body.deliveryAddress || null,
    ordersCode: ordersCode,
    note: req.body.note,
    status: Number(req.body.status),
    payment: Number(req.body.payment),
    total: Number(req.body.total),
    paid: Number(req.body.paid),
  });

  const details = req.body.details;
  details.forEach(async (item) => {
    const ordersDetail = new OrdersDetail({
      orders: orders._id,
      product: item.product._id,
      color: item.color._id,
      size: item.size._id,
      price: Number(item.price),
      quantity: Number(item.quantity),
    });
    const savedOrdersDetail = await ordersDetail.save();

    // update quantity (size)
    const size = await Size.findOne({
      $and: [{ active: 1 }, { _id: ObjectId(item.size._id) }],
    });
    size.quantity = Number(size.quantity) - Number(item.quantity);
    await size.save();

    // push
    await orders.updateOne({
      $push: { ordersDetails: savedOrdersDetail._id },
    });
  });

  const savedData = await orders.save();

  // const res1 = await Orders.findById(savedData._id).populate("ordersDetails");
  // res.status(200).json(res1);
  res
    .status(200)
    .json(
      await Orders.findById(savedData._id)
        .populate("ordersDetails")
        .populate("ordersStatuses")
    );
});

const update = asyncHandler(async (req, res) => {
  const orders = await Orders.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  orders.customer = req.body.customer;
  orders.deliveryAddress = req.body.deliveryAddress;
  orders.ordersCode = req.body.ordersCode;
  orders.note = req.body.note;
  orders.total = req.body.total;
  orders.status = req.body.status;
  orders.payment = req.body.payment;
  orders.paid = req.body.paid;

  const savedData = await orders.save();
  res
    .status(200)
    .json(
      await Orders.findById(savedData._id)
        .populate("ordersDetails")
        .populate("ordersStatuses")
    );
});

const remove = asyncHandler(async (req, res) => {
  const orders = await Orders.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  })
    .populate({
      path: "ordersDetails",
      populate: [
        {
          path: "product",
          model: "Product",
        },
        {
          path: "color",
          model: "Color",
        },
        {
          path: "size",
          model: "Size",
        },
      ],
    })
    .populate("ordersStatuses");

  // orders.ordersDetails.forEach(async (item) => {

  //   const size = await Size.findOne({
  //     $and: [{ active: 1 }, { _id: ObjectId(item.size._id) }],
  //   });
  //   size.quantity = Number(size.quantity) + Number(item.quantity);
  //   await size.save();
  // });

  orders.active = -1;
  const savedData = await orders.save();
  await OrdersDetail.updateMany({ orders: req.params.id }, { active: -1 });

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
