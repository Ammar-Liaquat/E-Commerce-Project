const express = require("express")
const routes = express.Router()
const middleware = require("../middelware/Auth")
routes.use(express.json())

const { createproduct, getproduct, } = require("../controllers/productControllers")

routes.post("/",middleware ,createproduct)
routes.get("/",middleware, getproduct)


module.exports = routes
