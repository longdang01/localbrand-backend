const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Orders = require("../models/Orders");

// @desc    GET statics
// @route   GET /api/statics/get-total-product-sales
// @access  Private
const getTotalProductSales = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
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
          path: "sales",
          model: "Discount",
        },
        {
          path: "codes",
          model: "Discount",
        },
      ],
    });

  let products = [];
  results.forEach((item) => {
    item.colors.forEach((item) => {
      if (item.sales.length != 0) {
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
  const query = { isActive: 1 };
  const products = await Product.find(query);
  res.status(200).json(products.length);
});

// @desc    GET statics
// @route   GET /api/statics/get-total-customers
// @access  Private
const getTotalCustomers = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const customers = await Customer.find(query);
  res.status(200).json(customers.length);
});

// @desc    GET statics
// @route   GET /api/statics/get-total-orders
// @access  Private
const getTotalOrders = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const ordersList = await Orders.find(query);
  res.status(200).json(ordersList.length);
});

module.exports = {
  getTotalProductSales,
  getTotalProducts,
  getTotalCustomers,
  getTotalOrders,
};
