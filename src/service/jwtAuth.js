const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (payload) => {
  const headers = {
    expiresIn: '30m',
    algorithm: 'HS256',
  };

  const token = jwt.sign(payload, SECRET_KEY, headers);
  return token;
}

// const validateJWT = (required = true) => (req, _res, next) => {
//   try {
//     const token = req.headers.authorization;
//     req.required = required;
//     const user = jwt.verify(token, SECRET_KEY);
//     req.user = user;
//     return next();
//   } catch (_) {
//     return next();
//   }
// };

const validateJWTToken = (token) => {
  try {
    const user = jwt.verify(token, SECRET_KEY);
    return user
  } catch (error) {
    throw error;
  }
}

module.exports = {
  validateJWTToken,
  generateToken
}