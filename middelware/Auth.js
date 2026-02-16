const jwt = require("jsonwebtoken");

const middleware = async (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];

    if (!token)
      return res.status(401).json({
        message: "token is missing",
        code: 401,
      });
    const dcode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = dcode;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Invalid Or expired token",
      code: 500,
      error: error.message,
    });
  }
};
module.exports = middleware;
