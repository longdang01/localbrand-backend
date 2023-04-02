const asyncHandler = require("express-async-handler");
const Discount = require("../models/Discount");
const Color = require("../models/Color");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const discounts = await Discount.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Discount.find(query).sort(sort).countDocuments();

  // res.status(200).json({ discounts: discounts, count: count });
  res.status(200).json(discounts);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          { discountName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const discounts = await Discount.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Discount.find(query).sort(sort).countDocuments();

  // res.status(200).json({ discounts: discounts, count: count });
  res.status(200).json(discounts);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const discount = await Discount.findOne(query);

  res.status(200).json(discount);
});

const create = asyncHandler(async (req, res) => {
  const discount = new Discount({
    color: req.body.color,
    discountName: req.body.discountName,
    value: req.body.value,
    symbol: req.body.symbol,
  });

  const savedData = await discount.save();
  await Color.updateMany({ _id: req.body.color }, { discount: savedData });

  res.status(200).json(await Discount.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const discount = await Discount.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });
  discount.color = req.body.color;
  discount.discountName = req.body.discountName;
  discount.value = req.body.value;
  discount.symbol = req.body.symbol;

  const savedData = await discount.save();
  await Color.updateMany({ _id: req.body.color }, { discount: savedData });

  res.status(200).json(await Discount.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const discount = await Discount.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  discount.active = -1;
  const savedData = await discount.save();
  await Color.updateMany({ _id: discount.color }, { discount: null });

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
