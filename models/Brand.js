const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
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

module.exports = mongoose.model("Brand", brandSchema);
