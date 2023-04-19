const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    cartDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartDetail",
      },
    ],
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

module.exports = mongoose.model("Cart", cartSchema);
