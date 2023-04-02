const mongoose = require("mongoose");

const ordersDetailSchema = mongoose.Schema(
  {
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Orders",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Color",
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Size",
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    active: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrdersDetail", ordersDetailSchema);
