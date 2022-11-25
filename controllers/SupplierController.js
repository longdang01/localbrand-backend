const asyncHandler = require("express-async-handler");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const { ObjectId } = require("mongodb");

// @desc    GET suppliers
// @route   GET /api/suppliers/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const suppliers = await Supplier.find(query).sort(sort);

  res.status(200).json(suppliers);
});

// @desc    POST suppliers
// @route   POST /api/suppliers/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const suppliers = await Supplier.find(query).sort(sort);

  res.status(200).json(suppliers);
});

// @desc    Get suppliers
// @route   GET /api/suppliers/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const supplier = await Supplier.findById(query);

  res.status(200).json(supplier);
});

// @desc    POST suppliers
// @route   POST /api/suppliers
// @access  Private
const create = asyncHandler(async (req, res) => {
  const supplier = new Supplier({
    picture: req.body.picture,
    supplierName: req.body.supplierName,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    description: req.body.description,
  });

  const savedData = await supplier.save();
  res.status(200).json(savedData);
});

// @desc    PUT suppliers
// @route   PUT /api/suppliers/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  supplier.picture = req.body.picture;
  supplier.supplierName = req.body.supplierName;
  supplier.address = req.body.address;
  supplier.phone = req.body.phone;
  supplier.email = req.body.email;
  supplier.description = req.body.description;

  const savedData = await supplier.save();
  res.status(200).json(savedData);
});

// @desc    DELETE suppliers
// @route   DELETE /api/suppliers/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  supplier.isActive = -1;

  await Product.updateMany({ supplier: req.params.id }, { supplier: null });

  const savedData = await supplier.save();
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
