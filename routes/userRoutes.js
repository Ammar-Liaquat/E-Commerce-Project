const express = require("express")
const { createuser, login, editpassword, getuser , deleteuser } = require("../controllers/userControlles")
const routes = express.Router()
routes.use(express.json())

routes.post("/user",createuser)
routes.post("/login",login)
routes.post("/user/:id",editpassword)
routes.get("/user",getuser)
routes.delete("/user/:id",deleteuser)

module.exports = routes