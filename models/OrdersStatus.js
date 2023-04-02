const mongoose = require("mongoose");

const ordersStatusSchema = mongoose.Schema(
  {
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Orders",
    },
    ordersStatusName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
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

module.exports = mongoose.model("OrdersStatus", ordersStatusSchema);
