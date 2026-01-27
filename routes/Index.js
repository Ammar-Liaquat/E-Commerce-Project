const express = require("express")
const routes = express.Router()

const productRoutes = require("./userProductRoutes")
const usersRoutes = require("./userRoutes")

routes.use("/", usersRoutes)
routes.use("/", productRoutes)

module.exports = routes