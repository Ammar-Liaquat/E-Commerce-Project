const nodemailer = require("nodemailer");

const express = require("express");
const mails = require("../config/mails");
const routes = express.Router();

routes.use("/mail", mails);

module.exports = routes;
