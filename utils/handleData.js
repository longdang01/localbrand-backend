const asyncHandler = require("express-async-handler");
const Size = require("../models/Size");
const CartDetail = require("../models/CartDetail");
const Cart = require("../models/Cart");

const getPrice = asyncHandler(async (color) => {
  if (!color.sales.length) {
    return color.price;
  } else {
    if (color.sales[0]?.symbol == "K")
      return color.price - color.sales[0]?.value;
    else return color.price * ((100 - color.sales[0]?.value) / 100);
  }
});

const updateSize = asyncHandler(async (cartDetail, action) => {
  let id = cartDetail.size._id || cartDetail.size;

  const size = await Size.findById(id);

  // 1: purchase, 0: when cancel orders
  if (action == 1) {
    if (size.quantity < cartDetail.quantity) {
      res.status(400);
      throw new Error("Số lượng mua đã vượt quá !");
    } else {
      size.quantity = size.quantity - cartDetail.quantity;
    }
  }

  if (action == 0) {
    size.quantity = size.quantity + cartDetail.quantity;
  }

  await size.save();
});

const deleteCartDetail = asyncHandler(async (cartDetail) => {
  const cartDetailSelect = await CartDetail.findById(cartDetail._id);
  cartDetailSelect.isActive = -1;
  const cart = Cart.findById(cartDetail.cart);
  await cart.updateOne({ $pull: { cartDetails: cartDetail._id } });

  await cartDetailSelect.save();
  //   res.status(200).json(savedData);
});
module.exports = {
  getPrice,
  updateSize,
  deleteCartDetail,
};
