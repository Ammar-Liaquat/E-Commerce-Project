const mongoose = require("mongoose");

const buyProduct = mongoose.Schema(
  {
    idproduct: { type: mongoose.Schema.Types.ObjectId, ref: "product" },

    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalprice: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("buyproduct", buyProduct);
