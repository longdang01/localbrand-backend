const mongoose = require("mongoose");

const colorSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    colorName: {
      type: String,
      required: true,
    },
    hex: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceImport: {
      type: Number,
      // required: true,
    },
    sizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
      },
    ],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ColorImage",
      },
    ],
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
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

module.exports = mongoose.model("Color", colorSchema);
