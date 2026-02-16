const express = require("express");
const routes = express.Router();
const middleware = require("../middelware/Auth");
routes.use(express.json());

const {
  createproduct,
  getproduct,
  getallproduct,
  editproduct,
  deleteproduct,
} = require("../controllers/productControllers");

routes.post("/product", middleware, createproduct);
routes.get("/userproduct", middleware, getproduct);
routes.get("/getproduct", getallproduct);
routes.patch("/editproduct/:id", middleware, editproduct);
routes.delete("/delproduct/:id", middleware, deleteproduct);

module.exports = routes;
