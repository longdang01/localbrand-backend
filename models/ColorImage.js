const mongoose = require("mongoose");

const colorImageSchema = mongoose.Schema(
  {
    color: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    picture: {
      type: String,
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

module.exports = mongoose.model("ColorImage", colorImageSchema);
