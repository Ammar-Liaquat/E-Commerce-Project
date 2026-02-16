const express = require("express");
const routes = express.Router();

const productRoutes = require("./userProductRoutes");
const usersRoutes = require("./userRoutes");
const buyRoutes = require("./buyRoutes");
const mails = require("./emailRoutes");

routes.use("/", usersRoutes);
routes.use("/", productRoutes);
routes.use("/", buyRoutes);
routes.use("/", mails);

module.exports = routes;
