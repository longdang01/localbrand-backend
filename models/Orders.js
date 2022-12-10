const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Payment",
    },
    transport: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Transport",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "DeliveryAddress",
    },
    ordersCode: {
      type: String,
      required: true,
      unique: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      required: true,
    },
    ordersDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrdersDetail",
      },
    ],
    ordersStatus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrdersStatus",
      },
    ],
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

module.exports = mongoose.model("Orders", ordersSchema);
