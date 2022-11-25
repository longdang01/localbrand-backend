const asyncHandler = require("express-async-handler");
const Discount = require("../models/Discount");
const Color = require("../models/Color");
const { ObjectId } = require("mongodb");

// @desc    GET discounts
// @route   GET /api/discounts/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      {
        isActive: 0,
      },
      {
        isActive: 1,
      },
    ],
  };
  const discounts = await Discount.find(query);

  res.status(200).json(discounts);
});

// @desc    POST discounts
// @route   POST /api/discounts/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      {
        isActive: 0,
      },
      {
        isActive: 1,
      },
    ],
  };
  const discounts = await Discount.find(query);

  res.status(200).json(discounts);
});
// @desc    Get discounts
// @route   GET /api/discounts/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const discount = await Discount.findById(query);

  res.status(200).json(discount);
});

// @desc    POST discounts
// @route   POST /api/discounts
// @access  Private
const create = asyncHandler(async (req, res) => {
  const discount = new Discount({
    color: req.body.color,
    discountName: req.body.discountName,
    value: req.body.value,
    symbol: req.body.symbol,
    amount: req.body.amount,
    isActive: req.body.isActive,
  });

  const savedData = await discount.save();
  const color = Color.findById(req.body.color);

  if (req.body.isActive == 0) {
    await color.updateOne({ $push: { sales: savedData._id } });
  }
  if (req.body.isActive == 1) {
    await color.updateOne({ $push: { codes: savedData._id } });
  }
  res.status(200).json(savedData);
});

// @desc    PUT discounts
// @route   PUT /api/discounts/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const discount = await Discount.findById(req.params.id);
  discount.color = req.body.color;
  discount.discountName = req.body.discountName;
  discount.value = req.body.value;
  discount.symbol = req.body.symbol;
  discount.amount = req.body.amount;
  discount.isActive = req.body.isActive;

  const savedData = await discount.save();
  res.status(200).json(savedData);
});

// @desc    DELETE discounts
// @route   DELETE /api/discounts/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const discount = await Discount.findById(req.params.id);
  if (discount.isActive === 0) {
    await Color.updateMany(
      { sales: req.params.id },
      { $pull: { sales: req.params.id } }
    );
  } else {
    await Color.updateMany(
      { codes: req.params.id },
      { $pull: { codes: req.params.id } }
    );
  }

  discount.isActive = -1;
  const savedData = await discount.save();
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
