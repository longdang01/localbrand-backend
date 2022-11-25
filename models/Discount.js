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
    symbol: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Discount", discountSchema);
