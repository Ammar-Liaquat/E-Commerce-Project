const Product = require("../models/productModels")

const createproduct = async (req,res)=>{

    try {
        const usid = req.user.id
        const {name, price, stock} = req.body
    const product = await Product.create({
        name,
        price,
        stock,
        userid:usid
    })
    res.status(201).json({
        message:"product create successfully",
        code:201,
        data:product,
    })
    } catch (error) {
      res.status(500).json({
        message:"internal server error",
        code:500,
        error:error.message
    })
    }
}

module.exports = {
    createproduct
}