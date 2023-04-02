const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Staff",
    },
    invoiceCode: {
      type: String,
      required: true,
      // unique: true,
    },
    note: {
      type: String,
    },
    total: {
      type: Number,
      required: true,
    },
    // 1: unpaid, 2: paid
    paid: {
      type: Number,
      required: true,
    },
    invoiceDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InvoiceDetail",
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

module.exports = mongoose.model("Invoice", invoiceSchema);
