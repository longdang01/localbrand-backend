const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Cart = require("../models/Cart");
const CartDetail = require("../models/CartDetail");

// @desc    GET carts
// @route   GET /api/carts/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const carts = await Cart.find(query)
    .sort(sort)
    .populate({
      path: "cartDetails",
      populate: [
        {
          path: "color",
          model: "Color",
          populate: [
            {
              path: "sizes",
              model: "Size",
            },
            {
              path: "images",
              model: "ColorImage",
            },
            {
              path: "sales",
              model: "Discount",
            },
            {
              path: "sales",
              model: "Discount",
            },
            {
              path: "codes",
              model: "Discount",
            },
          ],
        },
        {
          path: "size",
          model: "Size",
        },
        {
          path: "product",
          model: "Product",
        },
      ],
    });

  res.status(200).json(carts);
});

// @desc    POST carts
// @route   POST /api/carts/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ customer: req.body.customer }, { isActive: 1 }],
  };
  const sort = { createdAt: -1 };
  const carts = await Cart.findOne(query)
    .sort(sort)
    .populate({
      path: "cartDetails",
      populate: [
        {
          path: "color",
          model: "Color",
          populate: [
            {
              path: "sizes",
              model: "Size",
            },
            {
              path: "images",
              model: "ColorImage",
            },
            {
              path: "sales",
              model: "Discount",
            },
            {
              path: "codes",
              model: "Discount",
            },
          ],
        },
        {
          path: "size",
          model: "Size",
        },
        {
          path: "product",
          model: "Product",
          populate: [
            {
              path: "colors",
              model: "Color",
              populate: [
                {
                  path: "sizes",
                  model: "Size",
                },
                {
                  path: "images",
                  model: "ColorImage",
                },
                {
                  path: "sales",
                  model: "Discount",
                },
                {
                  path: "codes",
                  model: "Discount",
                },
              ],
            },
          ],
        },
      ],
    });

  res.status(200).json(carts);
});

// @desc    Get carts
// @route   GET /api/carts/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const cart = await Cart.findById(query).populate("cartDetails");

  res.status(200).json(cart);
});

// @desc    POST carts
// @route   POST /api/carts
// @access  Private
const create = asyncHandler(async (req, res) => {
  const cart = new Cart({
    customer: req.body.customer,
  });

  const savedData = await cart.save();
  res.status(200).json(savedData);
});

// @desc    PUT carts
// @route   PUT /api/carts/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  cart.customer = req.body.customer;

  const savedData = await cart.save();
  res.status(200).json(savedData);
});

// @desc    DELETE carts
// @route   DELETE /api/carts/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  cart.isActive = -1;

  CartDetail.updateMany({ cart: req.params.id }, { cart: null });
  const savedData = await cart.save();
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
