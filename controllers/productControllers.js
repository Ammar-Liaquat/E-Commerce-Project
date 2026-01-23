const Product = require("../models/productModels")

const createproduct = async (req,res)=>{

    try {
        
    const product = await Product.create(req.body)
    res.status(201).json({
        message:"product create successfully",
        code:201,
        data:product
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