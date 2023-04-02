const mongoose = require("mongoose");

const cartDetailSchema = mongoose.Schema(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    quantity: {
      type: Number,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CartDetail", cartDetailSchema);
