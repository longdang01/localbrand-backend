const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    subCategoryName: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    path: {
      type: String,
      required: true,
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

module.exports = mongoose.model("SubCategory", subCategorySchema);
