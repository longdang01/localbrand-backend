const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const ImportProduct = require("../models/ImportProduct");
const Size = require("../models/Size");
const { createImportCode } = require("../utils/generate");

// @desc    GET importProducts
// @route   GET /api/importProducts/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: { $ne: -1 } };
  const sort = { createdAt: -1 };
  const importProducts = await ImportProduct.find(query)
    .sort(sort)
    .populate("product")
    .populate("color")
    .populate("size");

  res.status(200).json(importProducts);
});

// @desc    POST importProducts
// @route   POST /api/importProducts/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: { $ne: -1 } };
  const sort = { createdAt: -1 };
  const importProducts = await ImportProduct.find(query)
    .sort(sort)
    .populate("product")
    .populate("color")
    .populate("size");

  res.status(200).json(importProducts);
});

// @desc    Get importProducts
// @route   GET /api/importProducts/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const importProduct = await ImportProduct.findById(query)
    .populate("product")
    .populate("color")
    .populate("size");

  res.status(200).json(importProduct);
});

// @desc    POST importProducts
// @route   POST /api/importProducts
// @access  Private
const create = asyncHandler(async (req, res) => {
  const code = await createImportCode();

  const importProduct = new ImportProduct({
    importCode: code,
    staff: req.body.staff,
    date: req.body.date,
    product: req.body.product,
    color: req.body.color,
    size: req.body.size,
    price: req.body.price,
    quantity: req.body.quantity,
    note: req.body.note || "",
    isActive: req.body.isActive,
  });

  const size = await Size.findById(req.body.size);
  size.isActive = 1;
  await size.save();

  const savedData = await importProduct.save();
  res
    .status(200)
    .json(
      await ImportProduct.findById(savedData._id)
        .populate("product")
        .populate("color")
        .populate("size")
    );
});

// @desc    PUT importProducts
// @route   PUT /api/importProducts/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const importProduct = await ImportProduct.findById(req.params.id);
  // importProduct.importCode = req.body.importCode;
  // importProduct.staff = req.body.staff;
  // importProduct.date = req.body.date;
  // importProduct.product = req.body.product;
  // importProduct.color = req.body.color;
  // importProduct.size = req.body.size;
  // importProduct.price = req.body.price;
  // importProduct.quantity = req.body.quantity;
  importProduct.note = req.body.note;
  // importProduct.isActive = req.body.isActive;

  const savedData = await importProduct.save();

  res
    .status(200)
    .json(
      await ImportProduct.findById(savedData._id)
        .populate("product")
        .populate("color")
        .populate("size")
    );
});

// @desc    DELETE importProducts
// @route   DELETE /api/importProducts/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const importProduct = await ImportProduct.findById(req.params.id);
  importProduct.isActive = -1;

  const savedData = await importProduct.save();
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
