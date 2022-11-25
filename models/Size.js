const mongoose = require("mongoose");

const sizeSchema = mongoose.Schema(
  {
    color: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sizeName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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

module.exports = mongoose.model("Size", sizeSchema);
