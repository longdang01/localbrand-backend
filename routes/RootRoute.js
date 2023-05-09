const categoryRoute = require("./CategoryRoute");
const subCategoryRoute = require("./SubCategoryRoute");
const slideRoute = require("./SlideRoute");
const supplierRoute = require("./SupplierRoute");
const brandRoute = require("./BrandRoute");
const collectionRoute = require("./CollectionRoute");
const collectionImageRoute = require("./CollectionImageRoute");
const productRoute = require("./ProductRoute");
const colorRoute = require("./ColorRoute");
const colorImageRoute = require("./ColorImageRoute");
const sizeRoute = require("./SizeRoute");
const discountRoute = require("./DiscountRoute");
const invoiceRoute = require("./InvoiceRoute");
const invoiceDetailRoute = require("./InvoiceDetailRoute");

const userRoute = require("./UserRoute");

const customerRoute = require("./CustomerRoute");
const staffRoute = require("./StaffRoute");

const ordersRoute = require("./OrdersRoute");
const ordersStatusRoute = require("./OrdersStatusRoute");
const ordersDetailRoute = require("./OrdersDetailRoute");
const deliveryAddressRoute = require("./DeliveryAddressRoute");

const cartRoute = require("./CartRoute");
const cartDetailRoute = require("./CartDetailRoute");

const vnPayRoute = require("./VnPayRoute");
const staticsRoute = require("./StaticsRoute");

// const transportRouter = require("./transport");
// const paymentRouter = require("./payment");
// const newsRouter = require("./news");
// const roleRouter = require("./role");
// const importProductRouter = require("./importProduct");

const lookbookRoute = require("./LookbookRoute");
const lookbookImageRoute = require("./LookbookImageRoute");

const uploadRouter = require("./UploadRoute");

const useRoutes = (app) => {
  app.use("/api/categories", categoryRoute);
  app.use("/api/subCategories", subCategoryRoute);
  app.use("/api/slides", slideRoute);
  app.use("/api/brands", brandRoute);
  app.use("/api/suppliers", supplierRoute);
  app.use("/api/collections", collectionRoute);
  app.use("/api/collectionImages", collectionImageRoute);

  app.use("/api/products", productRoute);
  app.use("/api/colors", colorRoute);
  app.use("/api/colorImages", colorImageRoute);
  app.use("/api/sizes", sizeRoute);
  app.use("/api/discounts", discountRoute);
  app.use("/api/invoices", invoiceRoute);
  app.use("/api/invoiceDetails", invoiceDetailRoute);

  app.use("/api/users", userRoute);

  app.use("/api/customers", customerRoute);
  app.use("/api/staffs", staffRoute);
  app.use("/api/orderses", ordersRoute);
  app.use("/api/ordersDetails", ordersDetailRoute);
  app.use("/api/ordersStatuses", ordersStatusRoute);
  app.use("/api/deliveryAddresses", deliveryAddressRoute);

  app.use("/api/carts", cartRoute);
  app.use("/api/cartDetails", cartDetailRoute);

  app.use("/api/vnPays", vnPayRoute);

  // app.use("/api/transports", transportRouter);
  // app.use("/api/payments", paymentRouter);
  // app.use("/api/news", newsRouter);
  // app.use("/api/roles", roleRouter);
  app.use("/api/statics", staticsRoute);
  // app.use("/api/importProducts", importProductRouter);

  app.use("/api/lookbooks", lookbookRoute);
  app.use("/api/lookbookImages", lookbookImageRoute);

  app.use("/api/upload", uploadRouter);
};

module.exports = useRoutes;
