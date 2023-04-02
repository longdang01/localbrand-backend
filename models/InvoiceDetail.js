const mongoose = require("mongoose");

const invoiceDetailSchema = mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Invoice",
    },
    //111 30 2
    //111 30 2
    //111 40 3
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Color",
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Size",
    },
    priceImport: {
      type: Number,
      required: true,
    },
    quantity: {
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

module.exports = mongoose.model("InvoiceDetail", invoiceDetailSchema);
