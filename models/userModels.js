const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshtoken: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    otp: Number,

    isVerify: {
      type: Boolean,
      default: false,
    },
    otpExpiry: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
