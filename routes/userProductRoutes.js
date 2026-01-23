const express = require("express")
const routes = express.Router()
const {middleware} = require("../middelware/Auth")
routes.use(express.json())

const { createproduct } = require("../controllers/productControllers")

routes.post("/",middleware ,createproduct)

module.exports = routes
