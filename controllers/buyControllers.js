const buyProduct = require("../models/buyModels");
const Product = require("../models/productModels");

const buyproduct = async (req, res) => {
  try {
    const productbuy = req.body
    let orders = []
    for(const items of productbuy){
    const { name, quantity, id } = items;
    const product = await Product.findById(id);
    if (!product)
      return res.status(401).json({
        message: `Invalid Id ${id}`,
        code: 401,
      });
      if (product.name !== name)
        return res.status(401).json({
          message: `product name is wrong ${id}`,
          code: 401,
        });
      if (product.stock < quantity)
        return res.status(409).json({
          message: `stock is empty${id}`,
          code: 409,
        });
  
      const order = await buyProduct.create({
        idproduct: product._id,
        name,
        quantity,
        totalprice: product.price * quantity,
      });

      product.stock -= quantity;
      await product.save();
      orders.push(order)
      
    }
    res.status(200).json({
      message: "product buy successfully",
      code: 200,
      data: orders,
    });
  
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

const boughtproduct = async (req, res) => {
  try {
    const product = await buyProduct.find();
    res.status(200).json({
      message: 200,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  buyproduct,
  boughtproduct,
};
