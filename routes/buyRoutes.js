const express = require("express")
const routes = express.Router()
routes.use(express.json())
const middelware = require("../middelware/Auth")
const { buyproduct, boughtproduct } = require("../controllers/buyControllers")


routes.post("/buy/:id",middelware, buyproduct)
routes.get("/myproduct",middelware, boughtproduct)

module.exports = routes
