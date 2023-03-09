const asyncHandler = require("express-async-handler");
const Orders = require("../models/Orders");
const Customer = require("../models/Customer");
const OrdersStatus = require("../models/OrdersStatus");
const OrdersDetail = require("../models/OrdersDetail");
const { ObjectId } = require("mongodb");
const { createOrdersCode } = require("../utils/generate");
const {
  getPrice,
  updateSize,
  deleteCartDetail,
} = require("../utils/handleData");

const { sendMail } = require("../utils/mail");

// @desc    GET orders
// @route   GET /api/orders/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: { $ne: -1 } };
  const sort = { createdAt: -1 };
  const ordersList = await Orders.find(query)
    .sort(sort)
    .populate("payment")
    .populate("transport")
    .populate("customer")
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
  const query = {
    $and: [{ customer: req.body.customer }, { isActive: { $ne: -1 } }],
  };
  const sort = { createdAt: -1 };
  const ordersList = await Orders.find(query)
    .sort(sort)
    .populate("payment")
    .populate("transport")
    .populate("customer")
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
  const query = { _id: ObjectId(req.params.id) };
  const orders = await Orders.findById(query)
    .populate("payment")
    .populate("transport")
    .populate("customer")
    .populate({
      path: "deliveryAddress",
      populate: [
        {
          path: "customer",
          model: "Customer",
        },
      ],
    })
    .populate({
      path: "ordersDetails",
      model: "OrdersDetail",
      populate: [
        {
          path: "orders",
          model: "Orders",
        },
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
    .populate("ordersStatus");

  res.status(200).json(orders);
});

// @desc    POST orders
// @route   POST /api/orders
// @access  Private
// purchase

const create = asyncHandler(async (req, res) => {
  if (!req.body.note) req.body.note = null;
  const code = await createOrdersCode();
  const orders = new Orders({
    payment: req.body.payment,
    transport: req.body.transport,
    customer: req.body.customer,
    deliveryAddress: req.body.deliveryAddress,
    ordersCode: code,
    orderDate: new Date().toISOString().slice(0, 10),
    note: req.body.note,
    total: req.body.total,
    status: 0,
    paid: req.body.isPaid ? 1 : 0,
  });

  const savedData = await orders.save();

  // add ordersDetails
  let contentEmail = "";
  const cartDetails = req.body.cartDetails;
  for (let i = 0; i < cartDetails.length; i++) {
    const ordersDetail = new OrdersDetail({
      orders: savedData._id,
      product: cartDetails[i].product._id,
      color: cartDetails[i].color._id,
      size: cartDetails[i].size._id,
      price: await getPrice(cartDetails[i].color),
      quantity: cartDetails[i].quantity,
      note: null,
      status: 0,
    });

    await updateSize(cartDetails[i], 1);

    const savedOrdersDetail = await ordersDetail.save();
    await savedData.updateOne({
      $push: { ordersDetails: { $each: [savedOrdersDetail._id] } },
    });

    await deleteCartDetail(cartDetails[i]);

    contentEmail += cartDetails[i].product.productName + "\n";
  }

  const customer = await Customer.findById(req.body.customer);
  console.log(customer.email);
  await sendMail(
    customer.email,
    `[FRAGILE ORDERS]: Đặt hàng thành công ngày ${savedData.orderDate}`,
    `Danh sách sản phẩm đặt bao gồm: \n${contentEmail}`
  );

  res.status(200).json(
    await Orders.findById(savedData._id)
      .populate("payment")
      .populate("transport")
      .populate("customer")
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

  // req.body.action 0: cancel, 1: purchase, revert
  if (orders.status == 4 && req.body.status != 4) {
    req.body.action = 1;
  }

  if (orders.status != 4 && req.body.status == 4) {
    req.body.action = 0;
  }

  orders.payment = req.body.payment;
  orders.transport = req.body.transport;
  orders.customer = req.body.customer;
  orders.deliveryAddress = req.body.deliveryAddress;
  orders.ordersCode = req.body.ordersCode;
  orders.orderDate = req.body.orderDate.slice(0, 10);
  orders.note = req.body.note;
  orders.total = req.body.total;
  orders.status = req.body.status;
  orders.paid = req.body.paid;

  let listOrdersDetails = req.body.ordersDetails;
  for (let i = 0; i < listOrdersDetails.length; i++) {
    await updateSize(listOrdersDetails[i], req.body.action);
  }

  const savedData = await orders.save();
  res.status(200).json(
    await Orders.findById(savedData._id)
      .populate("payment")
      .populate("transport")
      .populate("customer")
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
      .populate("customer")
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
