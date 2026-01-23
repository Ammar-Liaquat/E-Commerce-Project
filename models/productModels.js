const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    name: String,
    price: Number,
    stock: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("product", productSchema);
