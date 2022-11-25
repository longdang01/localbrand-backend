const mongoose = require("mongoose");

const transportSchema = mongoose.Schema(
  {
    transportType: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
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

module.exports = mongoose.model("Transport", transportSchema);
