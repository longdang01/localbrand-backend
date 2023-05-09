const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Orders = require("../models/Orders");
const Invoice = require("../models/Invoice");

// const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const calcSpending = asyncHandler(async (month) => {
  const year = new Date().getFullYear();
  const invoices = await Invoice.find({
    $and: [
      { active: 1 },
      {
        $expr: {
          $and: [
            { $eq: [{ $year: "$createdAt" }, year] },
            { $eq: [{ $month: "$createdAt" }, month] },
          ],
        },
      },
    ],
  });

  let result = 0;
  invoices.forEach((invoice) => {
    result += invoice.total + invoice.transportFee;
  });

  return { month: month, result: result };
});

const calcRevenue = asyncHandler(async (month) => {
  const year = new Date().getFullYear();
  const orderses = await Orders.find({
    $and: [
      { active: 1 },
      { status: 1 },
      {
        $expr: {
          $and: [
            { $eq: [{ $year: "$createdAt" }, year] },
            { $eq: [{ $month: "$createdAt" }, month] },
          ],
        },
      },
    ],
  });

  console.log(orderses);
  let result = 0;
  orderses.forEach((orders) => {
    result += orders.total + orders.transportFee;
  });

  return { month: month, result: result };
});

const getTotalSpending = asyncHandler(async (req, res) => {
  const result = [];

  MONTHS.forEach(async (month, index) => {
    result.push(await calcSpending(month));
    if (result.length == 12) {
      res.status(200).json(result);
    }
  });
});

const getRevenue = asyncHandler(async (req, res) => {
  const result = [];

  MONTHS.forEach(async (month, index) => {
    result.push(await calcRevenue(month));
    if (result.length == 12) {
      res.status(200).json(result);
    }
  });
});
// @desc    GET statics
// @route   GET /api/statics/get-total-product-sales
// @access  Private
const getTotalProductSales = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  const results = await Product.find(query)
    .sort(sort)
    .populate("subCategory")
    .populate({
      path: "colors",
      populate: [
        {
          path: "sizes",
          model: "Size",
        },
        {
          path: "images",
          model: "ColorImage",
        },
        {
          path: "discount",
          model: "Discount",
        },
      ],
    });

  let products = [];
  results.forEach((item) => {
    item.colors.forEach((item) => {
      if (item.discount) {
        products.push(item.product);
      }
    });
  });

  res.status(200).json(products.length);
});

// @desc    GET statics
// @route   GET /api/statics/get-total-products
// @access  Private
const getTotalProducts = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const products = await Product.find(query);
  res.status(200).json(products.length);
});

// @desc    GET statics
// @route   GET /api/statics/get-total-customers
// @access  Private
const getTotalCustomers = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const customers = await Customer.find(query);
  res.status(200).json(customers.length);
});

// @desc    GET statics
// @route   GET /api/statics/get-total-orders
// @access  Private
const getTotalOrders = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const ordersList = await Orders.find(query);
  res.status(200).json(ordersList.length);
});

module.exports = {
  getTotalProductSales,
  getTotalProducts,
  getTotalCustomers,
  getTotalOrders,
  getTotalSpending,
  getRevenue,
};
