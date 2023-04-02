const mongoose = require("mongoose");

const discountSchema = mongoose.Schema(
  {
    color: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    discountName: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    // 1: %, 2: K
    symbol: {
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

module.exports = mongoose.model("Discount", discountSchema);
