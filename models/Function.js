const mongoose = require("mongoose");

const functionSchema = mongoose.Schema(
  {
    functionName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
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

module.exports = mongoose.model("Function", functionSchema);
