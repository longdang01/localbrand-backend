const mongoose = require("mongoose");

const priceSchema = mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Price", priceSchema);
