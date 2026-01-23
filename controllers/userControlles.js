const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModels");

const createuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existemail = await User.findOne({ email });
    if (existemail)
      return res.status(409).json({
        message: "email already exist",
        code: 409,
      });
    const salt = await bcrypt.genSalt(12);
    const hashpassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: hashpassword,
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

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
        password: compare,
      });

    const payload = {
      id: user._id,
      email: user.email,
    };
    const accesstoken = jwt.sign(payload, process.env.SECRET_KEY,{expiresIn:"1d"});
    const refreshtoken = jwt.sign(payload, process.env.SECRET_KEY,{expiresIn:"7d"});

    res.status(200).json({
      message: "login succesfully",
      code: 200,
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message
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

const deleteuser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        code: 404,
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
  login,
  editpassword,
  getuser,
  deleteuser,
};
