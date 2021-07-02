const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const generateToken = (payload) => {
  try {
    const headers = {
      expiresIn: "30m",
      algorithm: "HS256",
    };

    const token = jwt.sign(payload, SECRET_KEY, headers);
    return token;
  } catch (error) {
    throw error;
  }
};

const validateJWTToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = {
  validateJWTToken,
  generateToken,
};
