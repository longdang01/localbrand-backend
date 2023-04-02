const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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

module.exports = mongoose.model("Supplier", supplierSchema);
