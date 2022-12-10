const productRouter = require("./product");
const supplierRouter = require("./supplier");
const categoryRouter = require("./category");
const brandRouter = require("./brand");
const subCategoryRouter = require("./subCategory");
const collectionRouter = require("./collection");
const collectionImageRouter = require("./collectionImage");
const colorRouter = require("./color");
const colorImageRouter = require("./colorImage");
const sizeRouter = require("./size");
const discountRouter = require("./discount");
const priceRouter = require("./price");
const transportRouter = require("./transport");
const paymentRouter = require("./payment");
const newsRouter = require("./news");
const ordersRouter = require("./orders");
const ordersStatusRouter = require("./ordersStatus");
const deliveryAddressRouter = require("./deliveryAddress");
const customerRouter = require("./customer");
const staffRouter = require("./staff");
const userRouter = require("./user");
const roleRouter = require("./role");
const slideRouter = require("./slide");
const cartRouter = require("./cart");
const cartDetailRouter = require("./cartDetail");
const ordersDetailRouter = require("./ordersDetail");

const uploadRouter = require("./upload");

const useRoutes = (app) => {
  app.use("/api/products", productRouter);
  app.use("/api/suppliers", supplierRouter);
  app.use("/api/categories", categoryRouter);
  app.use("/api/brands", brandRouter);
  app.use("/api/subCategories", subCategoryRouter);
  app.use("/api/collections", collectionRouter);
  app.use("/api/collectionImages", collectionImageRouter);
  app.use("/api/colors", colorRouter);
  app.use("/api/colorImages", colorImageRouter);
  app.use("/api/sizes", sizeRouter);
  app.use("/api/discounts", discountRouter);
  app.use("/api/prices", priceRouter);
  app.use("/api/transports", transportRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/news", newsRouter);

  app.use("/api/orders", ordersRouter);
  app.use("/api/ordersStatus", ordersStatusRouter);
  app.use("/api/deliveryAddress", deliveryAddressRouter);
  app.use("/api/customers", customerRouter);
  app.use("/api/staffs", staffRouter);
  app.use("/api/users", userRouter);
  app.use("/api/roles", roleRouter);
  app.use("/api/slides", slideRouter);

  app.use("/api/carts", cartRouter);
  app.use("/api/cartDetails", cartDetailRouter);
  app.use("/api/ordersDetails", ordersDetailRouter);

  app.use("/api/upload", uploadRouter);
};

module.exports = useRoutes;
