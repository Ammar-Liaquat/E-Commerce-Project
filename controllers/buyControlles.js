const buyProduct = require("../models/buyModels")
const Product = require("../models/productModels")


const buyproduct = async (req, res) => {
  try {
   const {id} = req.params;
   const {name,quantity} = req.body
   const product = await Product.findById(id)
   if(!product) return res.status(401).json({
    message:"Invalid Id",
    code:401
   })
   await Product.find({name}) 
   if(product.name !== name) return res.status(401).json({
    message:"product name is wrong",
    code:401
   })
   if(product.stock < quantity) return res.status(409).json({
    message:"stock is empty",
    code:409
   })

   const order = new buyProduct({
    idproduct:product._id,
    name,
    quantity,
    totalprice: product.price * quantity
   })

   await order.save()
    product.stock -= quantity
    await product.save()
    
    res.status(200).json({
      message:"product buy successfully",
      code:200,
      data:order
    })
  } catch (error) {
  
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

const boughtproduct = async (req,res)=>{

  try {
  const product = await buyProduct.find()
  res.status(200).json({
    message:200,
    data:product
 })
  } catch (error) {
    res.status(500).json({
      message:"internal server error",
      error:error.message
    })
  }
}

module.exports = {
    buyproduct,
    boughtproduct
}