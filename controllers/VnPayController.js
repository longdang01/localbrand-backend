var dateFormat = require("dateformat");
const asyncHandler = require("express-async-handler");
const moment = require("moment");
var config = require("config");
const { VNPay } = require("vn-payments");
/* eslint-disable no-param-reassign */
const TEST_CONFIG = VNPay.TEST_CONFIG;
const { checkoutVNPay, callbackVNPay } = require("../utils/vnpay-handlers");

const createPaymentUrl = asyncHandler(async (req, res, next) => {
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
        console.log(checkoutUrl);

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
});

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

// const createPaymentUrl = asyncHandler(async (req, res, next) => {
//   console.log("req", req);
//   var ipAddr =
//     req.headers["x-forwarded-for"] ||
//     req.connection.remoteAddress ||
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress;

//   // config
//   var tmnCode = process.env.vnp_TmnCode;
//   var secretKey = process.env.vnp_HashSecret;
//   var vnpUrl = process.env.vnp_Url;
//   var returnUrl = process.env.vnp_ReturnUrl;

//   var date = new Date();

//   var createDate = dateFormat(date, "yyyymmddHHmmss");
//   // var createDate = moment(date).format("YYYYMMDDHHmmss");
//   var orderId = dateFormat(date, "HHmmss");
//   // var orderId = moment(date).format("DDHHmmss");
//   var amount = req.body.amount || 1;
//   var bankCode = req.body.bankCode;

//   var orderInfo = req.body.orderDescription || "1";
//   var orderType = req.body.orderType || 1;
//   var locale = req.body.language;
//   if (locale === null || locale === "") {
//     locale = "vn";
//   }
//   var currCode = "VND";
//   var vnp_Params = {};
//   vnp_Params["vnp_Version"] = "2.1.0";
//   vnp_Params["vnp_Command"] = "pay";
//   vnp_Params["vnp_TmnCode"] = tmnCode;
//   // vnp_Params['vnp_Merchant'] = ''
//   vnp_Params["vnp_Locale"] = locale;
//   vnp_Params["vnp_CurrCode"] = currCode;
//   vnp_Params["vnp_TxnRef"] = orderId;
//   vnp_Params["vnp_OrderInfo"] = orderInfo;
//   vnp_Params["vnp_OrderType"] = orderType;
//   vnp_Params["vnp_Amount"] = amount * 100;
//   vnp_Params["vnp_ReturnUrl"] = returnUrl;
//   vnp_Params["vnp_IpAddr"] = ipAddr;
//   vnp_Params["vnp_CreateDate"] = createDate;
//   if (bankCode !== null && bankCode !== "") {
//     vnp_Params["vnp_BankCode"] = bankCode;
//   }

//   vnp_Params = sortObject(vnp_Params);

//   var querystring = require("qs");
//   var signData = querystring.stringify(vnp_Params, { encode: false });
//   var crypto = require("crypto");
//   var hmac = crypto.createHmac("sha512", secretKey);
//   var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
//   vnp_Params["vnp_SecureHash"] = signed;
//   vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

//   console.log(vnpUrl);
//   res
//     .status(200)
//     .json({ url: "https://bichill.vip/xem-phim-da-dieu/191152-11004.html" });

//   // res.redirect("https://bichill.vip/xem-phim-da-dieu/191152-11004.html");
// });

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  createPaymentUrl,
  vnPayCallback,
};
