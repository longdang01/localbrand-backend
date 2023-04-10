const mongoose = require("mongoose");

const lookbookSchema = mongoose.Schema(
  {
    lookbookName: {
      type: String,
      required: true,
    },
    collectionInfo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Collection",
    },
    description: {
      type: String,
    },
    lookbookImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LookbookImage",
      },
    ],
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

module.exports = mongoose.model("Lookbook", lookbookSchema);
