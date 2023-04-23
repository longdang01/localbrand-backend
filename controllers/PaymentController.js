const asyncHandler = require("express-async-handler");
const Payment = require("../models/Payment");
const { ObjectId } = require("mongodb");

const { checkoutVNPay, callbackVNPay } = require("../utils/vnpay-handlers");
const { response } = require("express");

// @desc    POST payments
// @route   POST /api/payments/checkout
// @access  Private
const checkout = (req, res) => {
  const userAgent = req.headers["user-agent"];

  const params = Object.assign({}, req.body);

  const clientIp =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // const amount = parseInt(params.amount.replace(/,/g, ""), 10);
  console.log(params);
  const amount = req.body.total;
  const now = new Date();

  // NOTE: only set the common required fields and optional fields from all gateways here, redundant fields will invalidate the payload schema checker
  const checkoutData = {
    amount,
    clientIp: clientIp.length > 15 ? "127.0.0.1" : clientIp,
    locale: "vn",
    // billingCity: params.billingCity || "",
    // billingPostCode: params.billingPostCode || "",
    // billingStateProvince: params.billingStateProvince || "",
    // billingStreet: params.billingStreet || "",
    // billingCountry: params.billingCountry || "",
    // deliveryAddress: params.billingStreet || "",
    // deliveryCity: params.billingCity || "",
    // deliveryCountry: params.billingCountry || "",
    // currency: "VND",
    // deliveryProvince: params.billingStateProvince || "",
    // customerEmail: params.email,
    // customerPhone: params.phoneNumber,
    orderId: `node-${now.toISOString()}`,
    // returnUrl: ,
    transactionId: `node-${now.toISOString()}`, // same as orderId (we don't have retry mechanism)
    // customerId: params.email,
  };

  // pass checkoutData to gateway middleware via res.locals
  res.locals.checkoutData = checkoutData;
  // Note: these handler are asynchronous
  let asyncCheckout = null;
  asyncCheckout = checkoutVNPay(req, res);
  console.log(asyncCheckout);
  if (asyncCheckout) {
    asyncCheckout
      .then((checkoutUrl) => {
        // console.log(checkoutUrl);
        res.status(200).json({ url: checkoutUrl.href });
        // console.log(checkoutUrl.href);

        // res.writeHead(301, { Location: checkoutUrl.href });
        // res.end();
      })
      .catch((err) => {
        res.send(err.message);
      });
  } else {
    res.send("Payment method not found");
  }
};

// @desc    GET payments
// @route   GET /api/payments/vnpay/callback
// @access  Private
const vnPayCallback = (req, res) => {
  // const gateway = req.params.gateway;
  // console.log('gateway', req.params.gateway);
  let asyncFunc = null;
  asyncFunc = callbackVNPay(req, res);

  // switch (gateway) {
  // 	case 'onepaydom':
  // 		asyncFunc = callbackOnePayDomestic(req, res);
  // 		break;
  // 	case 'onepayintl':
  // 		asyncFunc = callbackOnePayInternational(req, res);
  // 		break;
  // 	case 'vnpay':
  // 		asyncFunc = callbackVNPay(req, res);
  // 		break;
  // 	case 'sohapay':
  // 		asyncFunc = callbackSohaPay(req, res);
  // 		break;
  // 	case 'nganluong':
  // 		asyncFunc = callbackNganLuong(req, res);
  // 		break;
  // 	default:
  // 		break;
  // }

  if (asyncFunc) {
    asyncFunc.then(() => {
      // res.status(200).json({ message: "Success" });
      // res.render("result", {
      //   title: `Nau Store Payment via ${gateway.toUpperCase()}`,
      //   isSucceed: res.locals.isSucceed,
      //   email: res.locals.email,
      //   orderId: res.locals.orderId,
      //   price: res.locals.price,
      //   message: res.locals.message,
      //   billingStreet: res.locals.billingStreet,
      //   billingCountry: res.locals.billingCountry,
      //   billingCity: res.locals.billingCity,
      //   billingStateProvince: res.locals.billingStateProvince,
      //   billingPostalCode: res.locals.billingPostalCode,
      // });
    });
  } else {
    res.send("No callback found");
  }
};

// @desc    GET payments
// @route   GET /api/payments/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: { $ne: -1 } };
  const payments = await Payment.find(query);

  res.status(200).json(payments);
});

// @desc    POST payments
// @route   POST /api/payments/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: { $ne: -1 } };
  const payments = await Payment.find(query);

  res.status(200).json(payments);
});

// @desc    Get payments
// @route   GET /api/payments/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const payment = await Payment.findById(query);

  res.status(200).json(payment);
});

// @desc    POST payments
// @route   POST /api/payments
// @access  Private
const create = asyncHandler(async (req, res) => {
  // req.body.paymentType =
  //   req.body.isActive == 1
  //     ? "Thanh toán chuyển khoản"
  //     : "Thanh toán khi nhận hàng";

  const payment = new Payment({
    paymentType: req.body.paymentType,
    description: req.body.description,
    isActive: req.body.isActive,
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
  payment.isActive = req.body.isActive;

  // payment.paymentType =
  //   req.body.isActive == 1
  //     ? "Thanh toán chuyển khoản"
  //     : "Thanh toán khi nhận hàng";
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
  checkout,
  vnPayCallback,
};
