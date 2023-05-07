const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    customerName: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
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

module.exports = mongoose.model("Customer", customerSchema);
