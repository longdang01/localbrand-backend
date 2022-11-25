const mongoose = require("mongoose");

const deliveryAddressSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    deliveryAddressName: {
      type: String,
      required: true,
    },
    consigneeName: {
      type: String,
      required: true,
    },
    consigneePhone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
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

module.exports = mongoose.model("DeliveryAddress", deliveryAddressSchema);
