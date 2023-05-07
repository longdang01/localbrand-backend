const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAddress",
    },
    ordersCode: {
      type: String,
      required: true,
      unique: true,
    },
    note: {
      type: String,
    },
    transportFee: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },

    /**
     * 1: da giao & thanh cong
     * 2: cho xac nhan
     * 3: da xac nhan & dang chuan bi
     * 4: da chuan bi & cho lay hang
     * 5: dang giao
     * 6: huy bo
     *
     *
     *
     */

    status: {
      type: Number,
      required: true,
    },
    // 1: truc tiep, 2: cod, 3: chuyen khoan
    payment: {
      type: Number,
      required: true,
    },
    // 1: chua thanh toan, thanh toan
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
    ordersStatuses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrdersStatus",
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

module.exports = mongoose.model("Orders", ordersSchema);
