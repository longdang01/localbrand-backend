const express = require("express");
const router = express.Router();

const {
  getTotalProductSales,
  getTotalProducts,
  getTotalCustomers,
  getTotalOrders,
  getRevenue,
  getTotalSpending,
} = require("../controllers/StaticsController");

//list api
router.get("/get-total-product-sales", getTotalProductSales);
router.get("/get-total-products", getTotalProducts);
router.get("/get-total-customers", getTotalCustomers);
router.get("/get-total-orders", getTotalOrders);
router.get("/get-total-spending", getTotalSpending);
router.get("/get-revenue", getRevenue);

module.exports = router;
