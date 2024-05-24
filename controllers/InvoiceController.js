const asyncHandler = require("express-async-handler");
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const InvoiceDetail = require("../models/InvoiceDetail");
const Color = require("../models/Color");
const Size = require("../models/Size");
const { ObjectId } = require("mongodb");
const { generateCode } = require("../utils/Functions");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const invoices = await Invoice.find(query)
    .sort(sort)
    .populate("invoiceDetails");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Invoice.find(query).sort(sort).countDocuments();
  const products = await Product.find(query);

  // res.status(200).json({ invoices: invoices, count: count });
  res.status(200).json({ invoices: invoices, products: products });
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);
  const pageIndex = Number(req.body.pageIndex) || 1;
  const pageSize = Number(req.body.pageSize) || 10;

  const skip = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const query = req.body.searchData
    ? {
        $and: [
          { invoiceCode: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  // const invoices = await Invoice.find(query)
  //   .sort(sort)
  //   .populate("invoiceDetails");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Invoice.find(query).sort(sort).countDocuments();

  // res.status(200).json({ invoices: invoices, count: count });
  const products = await Product.find({ active: 1 });

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .sort(sort)
      .populate("invoiceDetails")
      .skip(skip)
      .limit(limit),
    Invoice.countDocuments(query),
  ]);
  // res.status(200).json({ staffs, total });

  res.status(200).json({ invoices: invoices, products: products, total });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const invoice = await Invoice.findOne(query).populate({
    path: "invoiceDetails",
    populate: [
      {
        path: "product",
        model: "Product",
      },
      {
        path: "color",
        model: "Color",
      },
      {
        path: "size",
        model: "Size",
      },
    ],
  });

  res.status(200).json(invoice);
});

const getByCode = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { invoiceCode: req.body.invoiceCode }],
  };
  
  const invoice = await Invoice.findOne(query)
    .populate({
      path: "invoiceDetails",
      populate: [
        {
          path: "product",
          model: "Product",
        },
        {
          path: "color",
          model: "Color",
        },
        {
          path: "size",
          model: "Size",
        },
      ],
    })
    .populate({ path: "staff" });

  res.status(200).json(invoice);
});

const create = asyncHandler(async (req, res) => {
  // details
  const query = { active: 1 };
  const invoices = (await Invoice.find(query)) || [];

  const invoiceCode = await generateCode("IV", invoices, "invoiceCode", 5);

  const invoice = new Invoice({
    staff: req.body.staff,
    invoiceCode: invoiceCode,
    note: req.body.note,
    transportFee: Number(req.body.transportFee),
    total: Number(req.body.total),
    paid: Number(req.body.paid),
  });

  const details = req.body.details;
  details.forEach(async (item) => {
    const invoiceDetail = new InvoiceDetail({
      invoice: invoice._id,
      product: item.product._id,
      color: item.color._id,
      size: item.size._id,
      priceImport: Number(item.priceImport),
      quantity: Number(item.quantity),
    });
    const savedInvoiceDetail = await invoiceDetail.save();

    // update price import (color)
    const color = await Color.findOne({
      $and: [{ active: 1 }, { _id: ObjectId(item.color._id) }],
    });

    color.priceImport = Number(item.priceImport);
    await color.save();

    // update quantity (size)
    const size = await Size.findOne({
      $and: [{ active: 1 }, { _id: ObjectId(item.size._id) }],
    });
    size.quantity = Number(size.quantity) + Number(item.quantity);
    await size.save();

    // push
    await invoice.updateOne({
      $push: { invoiceDetails: savedInvoiceDetail._id },
    });
  });

  const savedData = await invoice.save();

  // const res1 = await Invoice.findById(savedData._id).populate("invoiceDetails");
  // res.status(200).json(res1);
  res
    .status(200)
    .json(await Invoice.findById(savedData._id).populate("invoiceDetails"));
});

const update = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  invoice.staff = req.body.staff;
  invoice.invoiceCode = req.body.invoiceCode;
  invoice.note = req.body.note;
  invoice.transportFee = req.body.transportFee;
  invoice.total = req.body.total;
  invoice.paid = req.body.paid;

  const savedData = await invoice.save();
  res
    .status(200)
    .json(await Invoice.findById(savedData._id).populate("invoiceDetails"));
});

const remove = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  }).populate({
    path: "invoiceDetails",
    populate: [
      {
        path: "product",
        model: "Product",
      },
      {
        path: "color",
        model: "Color",
      },
      {
        path: "size",
        model: "Size",
      },
    ],
  });

  invoice.invoiceDetails.forEach(async (item) => {
    const color = await Color.findOne({
      $and: [{ active: 1 }, { _id: ObjectId(item.color._id) }],
    });

    const savedColors = await InvoiceDetail.find({
      $and: [
        { active: 1 },
        { color: ObjectId(item.color._id) },
        { _id: { $ne: ObjectId(item._id) } },
      ],
    }).sort({
      createdAt: -1,
    });

    color.priceImport =
      savedColors && savedColors.length > 0 ? savedColors[0].priceImport : null;
    await color.save();

    const size = await Size.findOne({
      $and: [{ active: 1 }, { _id: ObjectId(item.size._id) }],
    });
    size.quantity = Number(size.quantity) - Number(item.quantity);
    await size.save();
  });

  invoice.active = -1;
  const savedData = await invoice.save();
  await InvoiceDetail.updateMany({ invoice: req.params.id }, { active: -1 });

  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getById,
  getByCode,
  create,
  update,
  remove,
};
