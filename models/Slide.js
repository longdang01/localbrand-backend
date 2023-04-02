const mongoose = require("mongoose");

const slideSchema = mongoose.Schema(
  {
    slideName: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    redirectLink: {
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

module.exports = mongoose.model("Slide", slideSchema);
