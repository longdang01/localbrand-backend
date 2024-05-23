const asyncHandler = require("express-async-handler");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };

  const suppliers = await Supplier.find(query).sort(sort);

  res.status(200).json(suppliers);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  const pageIndex = Number(req.body.pageIndex) || 1;
  const pageSize = Number(req.body.pageSize) || 10;

  const skip = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const query = req.body.searchData
    ? {
        $and: [
          { supplierName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  // const suppliers = await Supplier.find(query).sort(sort);
  // res.status(200).json(suppliers);
  const [suppliers, total] = await Promise.all([
    Supplier.find(query).sort(sort).skip(skip).limit(limit),
    Supplier.countDocuments(query),
  ]);
  res.status(200).json({ suppliers, total });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const supplier = await Supplier.findOne(query);

  res.status(200).json(supplier);
});

const create = asyncHandler(async (req, res) => {
  const supplier = new Supplier({
    supplierName: req.body.supplierName,
    picture: req.body.picture || "",
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    description: req.body.description || "",
  });

  const savedData = await supplier.save();

  res.status(200).json(await Supplier.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (supplier.picture !== req.body.picture) {
    await handleRemoveFile(supplier.picture);
  }

  supplier.supplierName = req.body.supplierName;
  supplier.picture = req.body.picture;
  supplier.address = req.body.address;
  supplier.phone = req.body.phone;
  supplier.email = req.body.email;
  supplier.description = req.body.description;

  const savedData = await supplier.save();
  res.status(200).json(await Supplier.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  if (supplier.picture) await handleRemoveFile(supplier.picture);

  supplier.active = -1;

  await Product.updateMany({ supplier: req.params.id }, { active: -1 });
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
