const asyncHandler = require("express-async-handler");
const Color = require("../models/Color");
const { ObjectId } = require("mongodb");
const Size = require("../models/Size");
const ColorImage = require("../models/ColorImage");
const Discount = require("../models/Discount");
const Product = require("../models/Product");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const colors = await Color.find(query)
    .sort(sort)
    .populate("product")
    .populate("sizes")
    .populate("images")
    .populate("discount");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Color.find(query).sort(sort).countDocuments();

  // res.status(200).json({ colors: colors, count: count });
  res.status(200).json(colors);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          { colorName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const colors = await Color.find(query)
    .sort(sort)
    .populate("product")
    .populate("sizes")
    .populate("images")
    .populate("discount");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Color.find(query).sort(sort).countDocuments();

  // res.status(200).json({ colors: colors, count: count });
  res.status(200).json(colors);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const color = await Color.findOne(query)
    .populate("product")
    .populate("sizes")
    .populate("images")
    .populate("discount");

  res.status(200).json(color);
});

const create = asyncHandler(async (req, res) => {
  const color = new Color({
    product: req.body.product,
    price: req.body.price,
    priceImport: req.body.priceImport || null,
    colorName: req.body.colorName,
    hex: req.body.hex,
  });

  const savedData = await color.save();

  const product = Product.findById(req.body.product);
  // await product.updateOne({ $push: { colors: savedData._id } });
  await product.updateOne({
    $push: { colors: { $each: [savedData._id], $position: 0 } },
  });

  res
    .status(200)
    .json(
      await Color.findById(savedData._id)
        .populate("product")
        .populate("sizes")
        .populate("images")
        .populate("discount")
    );
});

const update = asyncHandler(async (req, res) => {
  const color = await Color.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  color.product = req.body.product;
  color.price = req.body.price;
  color.priceImport = req.body.priceImport || null;
  color.colorName = req.body.colorName;
  color.hex = req.body.hex;

  const savedData = await color.save();
  res
    .status(200)
    .json(
      await Color.findById(savedData._id)
        .populate("product")
        .populate("sizes")
        .populate("images")
        .populate("discount")
    );
});

const remove = asyncHandler(async (req, res) => {
  const color = await Color.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  })
    .populate("product")
    .populate("sizes")
    .populate("images")
    .populate("discount");

  color.active = -1;
  const savedData = await color.save();

  Size.updateMany({ color: req.params.id }, { active: -1 });
  ColorImage.updateMany({ color: req.params.id }, { active: -1 });
  Discount.updateMany({ color: req.params.id }, { active: -1 });

  await Product.updateMany(
    { colors: req.params.id },
    { $pull: { colors: req.params.id } }
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
