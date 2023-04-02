const asyncHandler = require("express-async-handler");
const InvoiceDetail = require("../models/InvoiceDetail");
const Invoice = require("../models/Invoice");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const invoiceDetails = await InvoiceDetail.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await InvoiceDetail.find(query).sort(sort).countDocuments();

  // res.status(200).json({ invoiceDetails: invoiceDetails, count: count });
  res.status(200).json(invoiceDetails);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          // { categoryName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const invoiceDetails = await InvoiceDetail.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await InvoiceDetail.find(query).sort(sort).countDocuments();

  // res.status(200).json({ invoiceDetails: invoiceDetails, count: count });
  res.status(200).json(invoiceDetails);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const invoiceDetail = await InvoiceDetail.findOne(query);

  res.status(200).json(invoiceDetail);
});

const create = asyncHandler(async (req, res) => {
  const invoiceDetail = new InvoiceDetail({
    invoice: req.body.invoice,
    product: req.body.product,
    color: req.body.color,
    size: req.body.size,
    priceImport: req.body.priceImport,
    quantity: req.body.quantity,
  });
  const savedData = await invoiceDetail.save();

  res.status(200).json(await InvoiceDetail.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const invoiceDetail = await InvoiceDetail.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  invoiceDetail.invoice = req.body.invoice;
  invoiceDetail.product = req.body.product;
  invoiceDetail.color = req.body.color;
  invoiceDetail.size = req.body.size;
  invoiceDetail.priceImport = req.body.priceImport;
  invoiceDetail.quantity = req.body.quantity;

  const savedData = await invoiceDetail.save();
  res.status(200).json(await InvoiceDetail.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const invoiceDetail = await InvoiceDetail.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  invoiceDetail.active = -1;
  const savedData = await invoiceDetail.save();
  await Invoice.updateMany(
    { invoiceDetails: req.params.id },
    { $pull: { invoiceDetails: req.params.id } }
  );

  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};
