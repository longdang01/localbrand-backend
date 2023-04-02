const mongoose = require("mongoose");

const collectionSchema = mongoose.Schema(
  {
    collectionName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    collectionImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollectionImage",
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

module.exports = mongoose.model("Collection", collectionSchema);
