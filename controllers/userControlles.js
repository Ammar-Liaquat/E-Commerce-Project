const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModels");
const nodemailer = require("nodemailer");
const fs = require("fs");
const createuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "email already exist",
        code: 400,
      });
    }
    if (!email) {
      if (req.file) fs.unlinkSync(req.file.path); // image delete karo
      return res.status(400).json({ error: "Email required" });
    }
    if (!password) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "password required" });
    }
    if (!req.file) return res.status(400).json({ message: "image required" });
    const salt = await bcrypt.genSalt(12);
    const hashpassword = await bcrypt.hash(password, salt);

    const generateotp = Math.floor(100000 + Math.random() * 900000);

    user = await User.create({
      email,
      password: hashpassword,
      otp: generateotp,
      isVerify: false,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      avatar: req.file.path,
    });
    const transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,

      auth: {
        user: process.env.NodeMail_ID,
        pass: process.env.NodeMailPassword,
      },
    });

    await transport.sendMail({
      from: process.env.NodeMail_ID,
      to: user.email,
      subject: "Welcome to Ammar Company",
      text: ` your OTP code ${generateotp} valid for 5 minutes`,
    });

    res.status(200).json({
      message: "Otp is send to your email plz verify",
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    let user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        message: "user invalid",
        code: 401,
      });
    if (user.isVerify)
      return res.status(400).json({
        message: "user verified",
      });
    if (user.otp != otp || user.otpExpiry < Date.now())
      return res.status(401).json({
        message: "invalid otp or expires otp",
      });
    user.isVerify = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const payload = {
      id: user._id,
      email: user.email,
    };
    const accesstoken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const refreshtoken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    user.refreshtoken = refreshtoken;
    await user.save();
    res.status(201).json({
      message: "Signup successfully",
      code: 201,
      data: user,
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        message: "user not exist",
        code: 401,
      });
    const generateotp = Math.floor(100000 + Math.random() * 900000);

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NodeMail_ID,
        pass: process.env.NodeMailPassword,
      },
    });

    await transport.sendMail({
      from: process.env.NodeMail_ID,
      to: user.email,
      subject: "Resend OTP",
      text: ` your OTP code ${generateotp} valid for 5 minutes`,
    });
    user.otp = generateotp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    res.status(200).json({
      message: "OTP resent succesfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password +refreshtoken");
    if (!user)
      return res.status(401).json({
        message: "email not exsit",
        code: 401,
      });

    const compare = await bcrypt.compare(password, user.password);
    if (!compare)
      return res.status(401).json({
        message: "invalid password",
        code: 401,
      });
    if (!user.isVerify)
      return res.status(200).json({
        message: "plz verify OTP",
      });
    const payload = {
      id: user._id,
      email: user.email,
    };
    const accesstoken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const refreshtoken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    user = user.toObject();
    (delete user.password, delete user.refreshtoken, delete user.__v);
    res.status(200).json({
      message: "login succesfully",
      code: 200,
      data: user,
      accesstoken: accesstoken,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

const editpassword = async (req, res) => {
  try {
    const { email, newpassword, oldpassword } = req.body;

    const edit = await User.findOne({ email });
    if (!edit)
      return res.status(401).json({
        message: "User not found",
        code: 401,
      });
    const compare = await bcrypt.compare(oldpassword, edit.password);
    if (!compare)
      return res.status(401).json({
        message: "Oldpassword is wrong",
        code: 401,
      });
    const salt = await bcrypt.genSalt(12);
    const newhash = await bcrypt.hash(newpassword, salt);
    edit.password = newhash;
    await edit.save();
    res.status(200).json({
      message: "Password changed succesfully",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      code: 500,
    });
  }
};

const getuser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      message: "fetched user succesfully",
      code: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

const refresht = async (req, res) => {
  try {
    const { refreshtoken } = req.body;
    if (!refreshtoken)
      return res.status(401).json({
        message: "unauthorized",
        code: 401,
      });
    const verifytoken = jwt.verify(refreshtoken, process.env.SECRET_KEY);

    const payload = {
      id: verifytoken.id,
      email: verifytoken.email,
    };
    const newaccesstoken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(200).json({
      message: "token refresh succesfully",
      code: 200,
      data: newaccesstoken,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

const deleteuser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        code: 401,
      });
    }
    res.status(200).json({
      message: "user Delete succesfully",
      code: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

module.exports = {
  createuser,
  verifyotp,
  resendOtp,
  login,
  editpassword,
  getuser,
  deleteuser,
  refresht,
};
