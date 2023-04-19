const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Cart = require("../models/Cart");
const CartDetail = require("../models/CartDetail");

// @desc    GET cartDetails
// @route   GET /api/cartDetails/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = {
    $or: [{ active: 0 }, { active: 1 }],
  };
  const sort = { createdAt: -1 };
  const cartDetails = await CartDetail.find(query)
    .sort(sort)
    .populate("product")
    .populate("size")
    .populate("color");

  res.status(200).json(cartDetails);
});

// @desc    POST cartDetails
// @route   POST /api/cartDetails/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = {
    $or: [{ active: 0 }, { active: 1 }],
  };
  const sort = { createdAt: -1 };
  const cartDetails = await CartDetail.find(query).sort(sort);

  res.status(200).json(cartDetails);
});

// @desc    Get cartDetails
// @route   GET /api/cartDetails/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const cartDetail = await CartDetail.findById(query)
    .populate({
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
    })
    .populate("size")
    .populate({
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
    });

  res.status(200).json(cartDetail);
});

const getByVariant = asyncHandler(async (req, res) => {
  // if customer not init cart => create new cart
  const cart = await Cart.findOne({
    $and: [{ customer: req.body.customer }, { active: 1 }],
  });

  const cartDetail = await CartDetail.findOne({
    $and: [
      { product: req.body.product },
      { color: req.body.color },
      { size: req.body.size },
      { cart: cart._id },
      { active: { $ne: -1 } },
    ],
  });

  res.status(200).json(cartDetail);
});

// @desc    POST cartDetails
// @route   POST /api/cartDetails
// @access  Private
// add to cart
const create = asyncHandler(async (req, res) => {
  // if customer not init cart => create new cart
  const cart = await Cart.findOne({
    $and: [{ customer: req.body.customer }, { active: 1 }],
  });

  // check exists item in cart
  let cartDetail = await CartDetail.findOne({
    $and: [
      { product: req.body.product },
      { color: req.body.color },
      { size: req.body.size },
      { cart: cart._id },
      { active: { $ne: -1 } },
    ],
  });

  if (cartDetail) {
    req.body.quantity = Number(req.body.quantity) + Number(cartDetail.quantity);
  } else {
    cartDetail = new CartDetail();
  }

  // if (req.body.quantity > req.body.maxQuantity) {
  //   res.status(400);
  //   throw new Error(
  //     `Sản Phẩm Đã Có Trong Giỏ, Bạn Chỉ Được Chọn Thêm ${
  //       Number(req.body.maxQuantity) - Number(cartDetail.quantity)
  //     }`
  //   );
  // }

  // check exists
  const check = cartDetail ? true : false;
  cartDetail.cart = cart._id;
  cartDetail.product = req.body.product;
  cartDetail.color = req.body.color;
  cartDetail.size = req.body.size;
  cartDetail.quantity = Number(req.body.quantity);
  cartDetail.active = 2;
  const savedData = await cartDetail.save();

  if (!check) {
    await cart.updateOne({
      $push: { cartDetails: { $each: [savedData._id], $position: 0 } },
    });
  }

  if (check) {
    await cart.updateOne({ $pull: { cartDetails: savedData._id } });

    await cart.updateOne({
      $push: { cartDetails: { $each: [savedData._id], $position: 0 } },
    });
  }

  res.status(200).json(savedData);
});

// @desc    PUT cartDetails
// @route   PUT /api/cartDetails/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const cartDetail = await CartDetail.findById(req.params.id);

  // if (req.body.quantity > req.body.maxQuantity) {
  //   res.status(400);
  //   throw new Error("Số lượng trong giỏ hàng đã vượt quá");
  // }

  // const check = req.body.cart.cartDetails.find(
  //   (item) =>
  //     item.product._id == req.body.product &&
  //     item.color._id == req.body.color &&
  //     item.size._id == req.body.size &&
  //     item._id != cartDetail._id
  // );

  // if (check) {
  //   res.status(400);
  //   throw new Error("Phân loại sản phẩm này đã có trong giỏ hàng");
  // }

  cartDetail.cart = req.body.cart;
  cartDetail.product = req.body.product;
  cartDetail.color = req.body.color;
  cartDetail.size = req.body.size;
  cartDetail.quantity = req.body.quantity;
  cartDetail.active = req.body.active;

  const savedData = await cartDetail.save();
  res.status(200).json(
    await CartDetail.findById(savedData._id)
      .populate({
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
                path: "discount",
                model: "Discount",
              },
            ],
          },
        ],
      })
      .populate("size")
      .populate({
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
            path: "discount",
            model: "Discount",
          },
        ],
      })
  );
});

// @desc    DELETE cartDetails
// @route   DELETE /api/cartDetails/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const cartDetail = await CartDetail.findById(req.params.id);
  cartDetail.active = -1;

  const cart = Cart.findById(cartDetail.cart);
  await cart.updateOne({ $pull: { cartDetails: req.params.id } });

  // await Cart.updateMany(
  //   { cartDetails: req.params.id },
  //   { $pull: { cartDetails: req.params.id } }
  // );
  const savedData = await cartDetail.save();
  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getById,
  getByVariant,
  create,
  update,
  remove,
};
