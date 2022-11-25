const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    functions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Function",
      },
    ],
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

module.exports = mongoose.model("Role", roleSchema);
