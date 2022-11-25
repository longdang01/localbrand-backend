const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    paymentType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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

module.exports = mongoose.model("Payment", paymentSchema);
