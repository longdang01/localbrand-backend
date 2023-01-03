const asyncHandler = require("express-async-handler");
const Orders = require("../models/Orders");
const ImportProduct = require("../models/ImportProduct");

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

const createImportCode = asyncHandler(async (orders) => {
  const importProducts = await ImportProduct.find();

  if (importProducts.length == 0) {
    return 100000;
  }
  let max = 0;
  for (let i = 0; i < importProducts.length; i++) {
    if (max < Number(importProducts[i].importCode)) {
      max = Number(importProducts[i].importCode);
    }
  }
  return max + 1;
});

module.exports = {
  createOrdersCode,
  createImportCode,
};
