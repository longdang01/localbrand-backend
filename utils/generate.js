const asyncHandler = require("express-async-handler");
const Orders = require("../models/Orders");

const createOrdersCode = asyncHandler(async (orders) => {
  const ordersList = await Orders.find();

  if (ordersList.length == 0) {
    return 100000;
  }
  let max = 0;
  for (let i = 0; i < ordersList.length; i++) {
    if (max < Number(ordersList[i].ordersCode)) {
      max = Number(ordersList[i].ordersCode);
    }
  }
  return max + 1;
});

module.exports = {
  createOrdersCode,
};
