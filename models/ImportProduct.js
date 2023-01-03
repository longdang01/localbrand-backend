const mongoose = require("mongoose");

const importProductSchema = mongoose.Schema(
  {
    importCode: {
      type: String,
      required: true,
      unique: true,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Staff",
    },
    date: {
      type: Date,
      required: true,
    },
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
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
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

module.exports = mongoose.model("ImportProduct", importProductSchema);
