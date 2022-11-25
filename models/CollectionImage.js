const mongoose = require("mongoose");

const collectionImageSchema = mongoose.Schema(
  {
    collectionInfo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    picture: {
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

module.exports = mongoose.model("CollectionImage", collectionImageSchema);
