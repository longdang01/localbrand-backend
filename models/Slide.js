const mongoose = require("mongoose");

const slideSchema = mongoose.Schema(
  {
    picture: {
      type: String,
      required: true,
    },
    slideName: {
      type: String,
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

module.exports = mongoose.model("Slide", slideSchema);
