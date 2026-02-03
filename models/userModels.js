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
    },
    refreshtoken: {
      type: String,
    },
    otp:Number,
    isVerify:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
